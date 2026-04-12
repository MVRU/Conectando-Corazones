import { prisma } from '$lib/infrastructure/prisma/client';
import type { Prisma } from '@prisma/client';
import type {
	AuditoriaPaginadaAdminDto,
	EstadoGestionUsuario,
	KpisPanelAdminDto,
	RegistroAuditoriaAdminDto,
	ReporteAdminItemDto,
	SolicitudOnboardingAdminDto,
	UsuarioAdminItemDto
} from '$lib/domain/types/dto/PanelAdmin';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { CancelarProyecto } from '$lib/domain/use-cases/proyectos/CancelarProyecto';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

type AccionResolverReporte = 'desestimar' | 'inhabilitar_cuenta' | 'forzar_baja_proyecto';
type AccionResolverOnboarding = 'aprobar' | 'rechazar';

interface FiltrosUsuarios {
	rol?: string;
	estadoGestion?: EstadoGestionUsuario;
	fechaAltaDesde?: Date;
	fechaAltaHasta?: Date;
}

interface FiltrosAuditoria {
	idObjeto?: number;
	usuarioId?: number;
	tipoObjeto?: string;
	accion?: string;
	atributoAfectado?: string;
	fechaDesde?: Date;
	fechaHasta?: Date;
	texto?: string;
	page?: number;
	pageSize?: number;
}

export class ServicioPanelAdmin {
	private readonly usuarioRepo = new PostgresUsuarioRepository();
	private readonly proyectoRepo = new PostgresProyectoRepository();

	async getKpis(): Promise<KpisPanelAdminDto> {
		const hace30Dias = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
		const [totalUsuarios, porRol, usuariosActivos, usuariosPendientes, usuariosInhabilitados] =
			await Promise.all([
				prisma.usuario.count(),
				prisma.usuario.groupBy({
					by: ['rol'],
					_count: { _all: true }
				}),
				prisma.usuario.count({
					where: {
						estado: { not: 'inactivo' },
						OR: [{ estado_verificacion: null }, { estado_verificacion: { not: 'pendiente' } }]
					}
				}),
				prisma.usuario.count({ where: { estado_verificacion: 'pendiente', estado: { not: 'inactivo' } } }),
				prisma.usuario.count({ where: { estado: 'inactivo' } })
			]);

		const [proyectosEnCurso, proyectosFinalizados, proyectosCancelados, reportesPendientes, reportesResueltosMes, onboardingPendiente] =
			await Promise.all([
				prisma.proyecto.count({
					where: { estado: { descripcion: 'en_curso' } }
				}),
				prisma.proyecto.count({
					where: { estado: { descripcion: { in: ['completado', 'cancelado'] } } }
				}),
				prisma.proyecto.count({
					where: { estado: { descripcion: 'cancelado' } }
				}),
				prisma.reporte.count({ where: { estado: 'pendiente' } }),
				prisma.reporte.count({
					where: {
						estado: { in: ['resuelto', 'rechazado'] },
						OR: [
							{
								fecha_resolucion: {
									gte: hace30Dias
								}
							},
							{
								fecha_resolucion: null,
								created_at: {
									gte: hace30Dias
								}
							}
						]
					}
				}),
				prisma.verificacion.count({ where: { estado: 'pendiente' } })
			]);

		const usuariosPorRol: Record<string, number> = {};
		for (const item of porRol) usuariosPorRol[item.rol] = item._count._all;

		return {
			totalUsuarios,
			usuariosPorRol,
			usuariosActivos,
			usuariosPendientes,
			usuariosInhabilitados,
			proyectosEnCurso,
			proyectosFinalizados,
			proyectosCancelados,
			reportesPendientes,
			reportesResueltosMes,
			onboardingPendiente
		};
	}

	async getOnboardingPendientes(): Promise<SolicitudOnboardingAdminDto[]> {
		const rows = await prisma.verificacion.findMany({
			where: { estado: 'pendiente' },
			orderBy: { created_at: 'asc' },
			include: {
				usuario: true,
				documentos: { orderBy: { created_at: 'desc' } }
			}
		});

		const mapped = rows.filter((v) => v.usuario).map(async (v) => {
			const documentos = await Promise.all(
				v.documentos.map(async (doc) => {
					const signed = await supabaseAdmin.storage
						.from('documentos-privados')
						.createSignedUrl(doc.url, 60 * 15);
					return {
						id_archivo: doc.id_archivo,
						nombre_original: doc.nombre_original ?? null,
						url: signed.data?.signedUrl ?? doc.url,
						tipo_mime: doc.tipo_mime ?? null,
						created_at: doc.created_at ?? null
					};
				})
			);

			return {
				id_verificacion: v.id_verificacion,
				usuario_id: v.usuario_id ?? 0,
				username: v.usuario?.username ?? '',
				nombre: v.usuario?.nombre ?? '',
				apellido: v.usuario?.apellido ?? '',
				rol: v.usuario?.rol ?? '',
				tipo: v.tipo,
				estado: v.estado,
				created_at: v.created_at ?? null,
				documentos
			};
		});

		return Promise.all(mapped);
	}

	async resolverOnboarding(input: {
		idVerificacion: number;
		accion: AccionResolverOnboarding;
		motivo?: string;
		adminId: number;
	}): Promise<void> {
		const { idVerificacion, accion, motivo, adminId } = input;
		if (accion === 'rechazar' && !motivo?.trim()) {
			throw new Error('Debés indicar un motivo de rechazo.');
		}

		await prisma.$transaction(async (tx) => {
			const verificacion = await tx.verificacion.findUnique({
				where: { id_verificacion: idVerificacion }
			});
			if (!verificacion || !verificacion.usuario_id) {
				throw new Error('La solicitud de onboarding no existe.');
			}
			const usuarioAnterior = await tx.usuario.findUnique({
				where: { id_usuario: verificacion.usuario_id },
				select: {
					estado: true,
					estado_verificacion: true
				}
			});

			const nuevoEstado = accion === 'aprobar' ? 'aprobada' : 'rechazada';
			const actualizacionUsuario =
				accion === 'aprobar'
					? { estado_verificacion: nuevoEstado, estado: 'activo' }
					: { estado_verificacion: nuevoEstado };
			const nuevoEstadoUsuario = accion === 'aprobar' ? 'activo' : (usuarioAnterior?.estado ?? 'inactivo');

			await tx.verificacion.update({
				where: { id_verificacion: idVerificacion },
				data: { estado: nuevoEstado }
			});

			await tx.usuario.update({
				where: { id_usuario: verificacion.usuario_id },
				data: actualizacionUsuario
			});

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Verificacion',
					id_objeto: idVerificacion,
					accion: 'Actualizar',
					atributo_afectado: 'estado',
					valor_anterior: verificacion.estado,
					valor_nuevo: nuevoEstado,
					justificacion:
						accion === 'aprobar'
							? 'Validación documental aprobada por administración.'
							: `Validación documental rechazada. Motivo enviado al usuario: ${motivo?.trim()}`,
					usuario_id: adminId
				}
			});

			if (usuarioAnterior && usuarioAnterior.estado_verificacion !== nuevoEstado) {
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Usuario',
						id_objeto: verificacion.usuario_id,
						accion: 'Actualizar',
						atributo_afectado: 'estado_verificacion',
						valor_anterior: usuarioAnterior.estado_verificacion ?? 'null',
						valor_nuevo: nuevoEstado,
						justificacion:
							accion === 'aprobar'
								? 'Verificación documental aprobada por administración.'
								: `Verificación documental rechazada por administración. Motivo: ${motivo?.trim() || 'Sin motivo'}`,
						usuario_id: adminId
					}
				});
			}

			if (usuarioAnterior && usuarioAnterior.estado !== nuevoEstadoUsuario) {
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Usuario',
						id_objeto: verificacion.usuario_id,
						accion: 'Actualizar',
						atributo_afectado: 'estado',
						valor_anterior: usuarioAnterior.estado,
						valor_nuevo: nuevoEstadoUsuario,
						justificacion:
							accion === 'aprobar'
								? 'Cuenta activada por aprobación de verificación documental.'
								: 'Cuenta inactivada por rechazo de verificación documental.',
						usuario_id: adminId
					}
				});
			}
		});
	}

	async getUsuarios(filtros: FiltrosUsuarios): Promise<UsuarioAdminItemDto[]> {
		const rows = await prisma.usuario.findMany({
			where: {
				...(filtros.rol ? { rol: filtros.rol } : {}),
				...(filtros.fechaAltaDesde || filtros.fechaAltaHasta
					? {
							created_at: {
								...(filtros.fechaAltaDesde ? { gte: filtros.fechaAltaDesde } : {}),
								...(filtros.fechaAltaHasta ? { lte: filtros.fechaAltaHasta } : {})
							}
						}
					: {})
			},
			orderBy: { created_at: 'desc' }
		});

		const mapped = rows.map((u) => ({
			id_usuario: u.id_usuario,
			username: u.username,
			nombre: u.nombre,
			apellido: u.apellido,
			rol: u.rol,
			estado: u.estado,
			estado_verificacion: u.estado_verificacion ?? null,
			estado_gestion: this.mapEstadoGestion(u.estado, u.estado_verificacion),
			created_at: u.created_at ?? null
		}));

		if (!filtros.estadoGestion) return mapped;
		return mapped.filter((u) => u.estado_gestion === filtros.estadoGestion);
	}

	async cambiarEstadoUsuario(input: {
		usuarioId: number;
		habilitar: boolean;
		adminId: number;
	}): Promise<void> {
		const { usuarioId, habilitar, adminId } = input;
		const usuario = await this.usuarioRepo.findById(usuarioId, true);
		if (!usuario) throw new Error('Usuario no encontrado.');

		// Regla: no permitir inhabilitar cuentas con actividad vigente.
		if (!habilitar) {
			const [tieneProyectosActivos, tieneColaboracionesActivas] = await Promise.all([
				this.usuarioRepo.hasActiveProjects(usuarioId),
				this.usuarioRepo.hasActiveCollaborations(usuarioId)
			]);

			if (tieneProyectosActivos && tieneColaboracionesActivas) {
				throw new Error(
					'No se puede inhabilitar: el usuario tiene proyectos en curso y participaciones activas.'
				);
			}
			if (tieneProyectosActivos) {
				throw new Error('No se puede inhabilitar: el usuario tiene proyectos en curso.');
			}
			if (tieneColaboracionesActivas) {
				throw new Error('No se puede inhabilitar: el usuario está participando en proyectos en curso.');
			}
		}

		await prisma.$transaction(async (tx) => {
			const estadoAnterior = usuario.estado;
			const estadoNuevo = habilitar ? 'activo' : 'inactivo';

			await tx.usuario.update({
				where: { id_usuario: usuarioId },
				data: { estado: estadoNuevo }
			});

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Usuario',
					id_objeto: usuarioId,
					accion: 'Actualizar',
					atributo_afectado: 'estado',
					valor_anterior: estadoAnterior,
					valor_nuevo: estadoNuevo,
					justificacion: habilitar
						? 'Cuenta habilitada por administración.'
						: 'Cuenta inhabilitada por administración.',
					usuario_id: adminId
				}
			});
		});
	}

	async getReportes(): Promise<ReporteAdminItemDto[]> {
		const rows = await prisma.reporte.findMany({
			orderBy: [{ estado: 'asc' }, { created_at: 'desc' }],
			include: { reportante: true }
		});

		const reportes: ReporteAdminItemDto[] = [];
		for (const row of rows) {
			const reportado = await this.obtenerNombreReportado(row.tipo_objeto, row.id_objeto);
			reportes.push({
				id_reporte: row.id_reporte,
				tipo_objeto: row.tipo_objeto,
				id_objeto: row.id_objeto,
				motivo: row.motivo,
				descripcion: row.descripcion,
				estado: row.estado ?? null,
				created_at: row.created_at ?? null,
				fecha_resolucion: row.fecha_resolucion ?? null,
				comentario_resolucion: row.comentario_resolucion ?? null,
				reportante: {
					id_usuario: row.reportante.id_usuario,
					username: row.reportante.username,
					nombre: row.reportante.nombre,
					apellido: row.reportante.apellido
				},
				reportado
			});
		}
		return reportes;
	}

	async resolverReporte(input: {
		reporteId: number;
		accion: AccionResolverReporte;
		comentario?: string;
		adminId: number;
	}): Promise<void> {
		const { reporteId, accion, comentario, adminId } = input;

		await prisma.$transaction(async (tx) => {
			const reporte = await tx.reporte.findUnique({
				where: { id_reporte: reporteId }
			});
			if (!reporte) throw new Error('Reporte no encontrado.');
			if (reporte.estado !== 'pendiente') throw new Error('El reporte ya fue resuelto.');

			if (accion === 'inhabilitar_cuenta') {
				if (reporte.tipo_objeto !== 'Usuario') {
					throw new Error('Solo se puede inhabilitar cuenta en reportes de usuario.');
				}

				const reportado = await tx.usuario.findUnique({
					where: { id_usuario: reporte.id_objeto }
				});
				if (!reportado) throw new Error('Usuario reportado no encontrado.');

				const [tieneProyectosActivos, tieneColaboracionesActivas] = await Promise.all([
					this.usuarioRepo.hasActiveProjects(reporte.id_objeto),
					this.usuarioRepo.hasActiveCollaborations(reporte.id_objeto)
				]);

				if (tieneProyectosActivos && tieneColaboracionesActivas) {
					throw new Error(
						'No se puede inhabilitar: el usuario tiene proyectos en curso y participaciones activas.'
					);
				}
				if (tieneProyectosActivos) {
					throw new Error('No se puede inhabilitar: el usuario tiene proyectos en curso.');
				}
				if (tieneColaboracionesActivas) {
					throw new Error('No se puede inhabilitar: el usuario está participando en proyectos en curso.');
				}

				await tx.usuario.update({
					where: { id_usuario: reporte.id_objeto },
					data: { estado: 'inactivo' }
				});

				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Usuario',
						id_objeto: reporte.id_objeto,
						accion: 'Actualizar',
						atributo_afectado: 'estado',
						valor_anterior: reportado.estado,
						valor_nuevo: 'inactivo',
						justificacion: comentario?.trim() || 'Cuenta inhabilitada por resolución de reporte.',
						usuario_id: adminId
					}
				});
			}

			if (accion === 'forzar_baja_proyecto') {
				if (reporte.tipo_objeto !== 'Proyecto') {
					throw new Error('Solo se puede forzar baja en reportes de proyecto.');
				}
				const cancelarProyecto = new CancelarProyecto(this.proyectoRepo);
				await cancelarProyecto.execute({
					proyectoId: reporte.id_objeto,
					usuarioId: adminId,
					rol: 'administrador',
					justificacion: comentario?.trim() || 'Baja forzada por resolución de reporte.'
				});
			}

			await tx.reporte.update({
				where: { id_reporte: reporteId },
				data: {
					estado: accion === 'desestimar' ? 'rechazado' : 'resuelto',
					fecha_resolucion: new Date(),
					comentario_resolucion: comentario?.trim() || null,
					admin_id: adminId
				}
			});

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Reporte',
					id_objeto: reporteId,
					accion: 'Actualizar',
					atributo_afectado: 'estado',
					valor_anterior: reporte.estado ?? 'pendiente',
					valor_nuevo: accion === 'desestimar' ? 'rechazado' : 'resuelto',
					justificacion: `Resolución administrativa del reporte con acción: ${accion}.`,
					usuario_id: adminId
				}
			});
		});
	}

	async getAuditoria(filtros: FiltrosAuditoria = {}): Promise<AuditoriaPaginadaAdminDto> {
		const page = filtros.page && filtros.page > 0 ? filtros.page : 1;
		const pageSize = filtros.pageSize && filtros.pageSize > 0 ? Math.min(filtros.pageSize, 200) : 100;
		const where: Prisma.HistorialDeCambiosWhereInput = {
			...(filtros.idObjeto ? { id_objeto: filtros.idObjeto } : {}),
			...(filtros.usuarioId ? { usuario_id: filtros.usuarioId } : {}),
			...(filtros.tipoObjeto
				? { tipo_objeto: { contains: filtros.tipoObjeto.trim(), mode: 'insensitive' } }
				: {}),
			...(filtros.accion ? { accion: { contains: filtros.accion.trim(), mode: 'insensitive' } } : {}),
			...(filtros.atributoAfectado
				? {
						atributo_afectado: {
							contains: filtros.atributoAfectado.trim(),
							mode: 'insensitive'
						}
					}
				: {}),
			...(filtros.fechaDesde || filtros.fechaHasta
				? {
						created_at: {
							...(filtros.fechaDesde ? { gte: filtros.fechaDesde } : {}),
							...(filtros.fechaHasta ? { lte: filtros.fechaHasta } : {})
						}
					}
				: {}),
			...(filtros.texto
				? {
						OR: [
							{ justificacion: { contains: filtros.texto.trim(), mode: 'insensitive' } },
							{ valor_anterior: { contains: filtros.texto.trim(), mode: 'insensitive' } },
							{ valor_nuevo: { contains: filtros.texto.trim(), mode: 'insensitive' } },
							{ tipo_objeto: { contains: filtros.texto.trim(), mode: 'insensitive' } },
							{ accion: { contains: filtros.texto.trim(), mode: 'insensitive' } },
							{ atributo_afectado: { contains: filtros.texto.trim(), mode: 'insensitive' } },
							{ usuario: { username: { contains: filtros.texto.trim(), mode: 'insensitive' } } }
						]
					}
				: {})
		};

		const [total, rows] = await Promise.all([
			prisma.historialDeCambios.count({ where }),
			prisma.historialDeCambios.findMany({
				where,
				orderBy: { created_at: 'desc' },
				include: {
					usuario: {
						select: {
							id_usuario: true,
							username: true,
							nombre: true,
							apellido: true
						}
					}
				},
				skip: (page - 1) * pageSize,
				take: pageSize
			})
		]);

		const items: RegistroAuditoriaAdminDto[] = rows.map((row) => ({
			id_cambio: row.id_cambio,
			tipo_objeto: row.tipo_objeto,
			id_objeto: row.id_objeto,
			accion: row.accion,
			atributo_afectado: row.atributo_afectado,
			valor_anterior: row.valor_anterior,
			valor_nuevo: row.valor_nuevo,
			justificacion: row.justificacion ?? null,
			created_at: row.created_at ?? null,
			usuario_id: row.usuario_id ?? null,
			admin: row.usuario
				? {
						id_usuario: row.usuario.id_usuario,
						username: row.usuario.username,
						nombre: row.usuario.nombre,
						apellido: row.usuario.apellido
					}
				: null
		}));

		return { items, total, page, pageSize };
	}

	private mapEstadoGestion(
		estado: string,
		estadoVerificacion: string | null | undefined
	): EstadoGestionUsuario {
		if (estado === 'inactivo') return 'inhabilitado';
		if (estadoVerificacion === 'pendiente') return 'pendiente';
		return 'activo';
	}

	private async obtenerNombreReportado(
		tipoObjeto: string,
		idObjeto: number
	): Promise<{ id: number; tipo: string; nombre: string }> {
		if (tipoObjeto === 'Usuario') {
			const usuario = await prisma.usuario.findUnique({
				where: { id_usuario: idObjeto }
			});
			return {
				id: idObjeto,
				tipo: 'Usuario',
				nombre: usuario ? `${usuario.nombre} ${usuario.apellido}`.trim() : `Usuario #${idObjeto}`
			};
		}
		if (tipoObjeto === 'Proyecto') {
			const proyecto = await prisma.proyecto.findUnique({
				where: { id_proyecto: idObjeto }
			});
			return {
				id: idObjeto,
				tipo: 'Proyecto',
				nombre: proyecto?.titulo ?? `Proyecto #${idObjeto}`
			};
		}
		return {
			id: idObjeto,
			tipo: tipoObjeto,
			nombre: `${tipoObjeto} #${idObjeto}`
		};
	}
}
