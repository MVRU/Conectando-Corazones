import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { Proyecto } from '$lib/domain/entities/Proyecto';
import type { EstadoDescripcion } from '$lib/domain/types/Estado';
import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ProyectoMapper } from './mappers/proyecto.mapper';
import { ProyectoCategoriaRepoPrisma } from './proyecto-categoria.repo';
import { PostgresCategoriaRepository } from './categoria.repo';
import { RegistrarCategoriasDeProyecto } from '$lib/domain/use-cases/proyecto-categoria/RegistrarCategoriasDeProyecto';
import type { ProyectoSearchCriteria } from '$lib/domain/types/dto/ProyectoSearchCriteria';

export class PostgresProyectoRepository implements ProyectoRepository {
	private includeOptions = {
		estado: true,
		proyecto_categorias: {
			include: { categoria: true }
		},
		participacion_permitida: {
			include: {
				tipo_participacion: true,
				colaboraciones_tipo_participacion: {
					include: {
						colaboracion: true
					}
				}
			}
		},
		proyecto_ubicaciones: {
			include: { ubicacion: { include: { localidad: { include: { provincia: true } } } } }
		},
		institucion: {
			include: {
				localidad: { include: { provincia: true } }
			}
		},
		colaboraciones: {
			include: {
				colaborador: {
					include: {
						localidad: { include: { provincia: true } },
						contactos: true
					}
				},
				colaboraciones_tipo_participacion: {
					include: {
						participacion_permitida: {
							include: { tipo_participacion: true }
						}
					}
				}
			}
		}
	};

	async findAll(): Promise<Proyecto[]> {
		const proyectos = await prisma.proyecto.findMany({
			include: this.includeOptions
		});

		return proyectos
			.map((p) => {
				try {
					return ProyectoMapper.toDomain(p as any);
				} catch (err) {
					console.error(`Error al procesar el proyecto ID: ${p.id_proyecto}:`, err);
					return null;
				}
			})
			.filter((p): p is Proyecto => p !== null);
	}

	async findByInstitucionId(institucionId: number): Promise<Proyecto[]> {
		const proyectos = await prisma.proyecto.findMany({
			where: { institucion_id: institucionId },
			include: this.includeOptions,
			orderBy: [{ estado_id: 'asc' }, { created_at: 'desc' }]
		});

		return proyectos
			.map((p) => {
				try {
					return ProyectoMapper.toDomain(p as any);
				} catch (err) {
					console.error(`Error al procesar el proyecto ID: ${p.id_proyecto}:`, err);
					return null;
				}
			})
			.filter((p): p is Proyecto => p !== null);
	}

	async findAllSummary(): Promise<Proyecto[]> {
		const proyectos = await prisma.proyecto.findMany({
			select: {
				id_proyecto: true,
				titulo: true,
				descripcion: true,
				resumen: true,
				url_portada: true,
				beneficiarios: true,
				created_at: true,
				fecha_fin_tentativa: true,
				institucion_id: true,
				estado_id: true,
				estado: {
					select: {
						id_estado: true,
						descripcion: true
					}
				},
				institucion: {
					select: {
						id_usuario: true,
						username: true,
						rol: true,
						nombre_legal: true,
						url_foto: true
					}
				},
				proyecto_categorias: {
					select: {
						categoria: {
							select: {
								id_categoria: true,
								descripcion: true
							}
						}
					}
				},
				participacion_permitida: {
					select: {
						id_participacion_permitida: true,
						id_proyecto: true,
						id_tipo_participacion: true,
						objetivo: true,
						unidad_medida: true,
						especie: true,
						colaboraciones_tipo_participacion: {
							select: {
								cantidad: true
							}
						},
						tipo_participacion: {
							select: {
								id_tipo_participacion: true,
								descripcion: true
							}
						}
					}
				},
				proyecto_ubicaciones: {
					select: {
						id_proyecto_ubicacion: true,
						proyecto_id: true,
						ubicacion_id: true,
						ubicacion: {
							select: {
								id_ubicacion: true,
								tipo_ubicacion: true,
								modalidad: true,
								calle: true,
								numero: true,
								piso: true,
								departamento: true,
								referencia: true,
								url_google_maps: true,
								url_virtual: true,
								localidad_id: true,
								localidad: {
									select: {
										id_localidad: true,
										nombre: true,
										codigo_postal: true,
										id_provincia: true,
										provincia: {
											select: {
												id_provincia: true,
												nombre: true,
												nombre_corto: true,
												codigo_iso: true
											}
										}
									}
								}
							}
						}
					}
				},
				colaboraciones: {
					select: {
						id_colaboracion: true,
						proyecto_id: true,
						colaborador_id: true,
						estado: true,
						justificacion: true
					}
				}
			},
			orderBy: [{ estado_id: 'asc' }, { created_at: 'desc' }]
		});

		return proyectos
			.map((p) => {
				try {
					return ProyectoMapper.toDomain(p as any);
				} catch (err) {
					console.error(`Error al procesar el proyecto ID: ${p.id_proyecto}:`, err);
					return null;
				}
			})
			.filter((p): p is Proyecto => p !== null);
	}

	async findById(id: number): Promise<Proyecto | null> {
		const proyecto = await prisma.proyecto.findUnique({
			where: { id_proyecto: id },
			include: this.includeOptions
		});
		try {
			return proyecto ? ProyectoMapper.toDomain(proyecto as any) : null;
		} catch (error) {
			console.error(`Error al procesar el proyecto ID: ${id}:`, error);
			return null;
		}
	}

	async findByUsuarioId(id: number): Promise<Proyecto[]> {
		const proyectos = await prisma.proyecto.findMany({
			where: {
				OR: [{ institucion_id: id }, { colaboraciones: { some: { colaborador_id: id } } }]
			},
			include: this.includeOptions
		});
		return proyectos.map((p) => ProyectoMapper.toDomain(p as any));
	}

	async search(criteria: ProyectoSearchCriteria): Promise<Proyecto[]> {
		const where: any = {};

		if (criteria.query) {
			where.OR = [
				{ titulo: { contains: criteria.query, mode: 'insensitive' } },
				{ descripcion: { contains: criteria.query, mode: 'insensitive' } }
			];
		}

		if (criteria.estado) {
			where.estado = {
				descripcion: criteria.estado
			};
		}

		if (criteria.categoriaIds && criteria.categoriaIds.length > 0) {
			where.proyecto_categorias = {
				some: {
					categoria_id: { in: criteria.categoriaIds }
				}
			};
		}

		const proyectos = await prisma.proyecto.findMany({
			where,
			include: this.includeOptions,
			skip: criteria.offset,
			take: criteria.limit
		});

		return proyectos.map((p) => ProyectoMapper.toDomain(p as any));
	}

	async create(proyecto: Proyecto): Promise<Proyecto> {
		const result = await prisma.$transaction(
			async (tx) => {
				// 1. Obtener el ID del estado solicitado (borrador o en_curso)
				const estadoDoc = await tx.estado.findUnique({
					where: { descripcion: proyecto.estado || 'en_curso' }
				});

				if (!estadoDoc)
					throw new Error(
						`Estado "${proyecto.estado || 'en_curso'}" no encontrado en la base de datos`
					);

				// 2. Crear el proyecto base
				const created = await tx.proyecto.create({
					data: {
						titulo: proyecto.titulo,
						descripcion: proyecto.descripcion,
						resumen: proyecto.resumen,
						aprendizajes: proyecto.aprendizajes,
						url_portada: proyecto.url_portada,
						institucion_id: proyecto.institucion_id!,
						created_at: new Date(),
						estado_id: estadoDoc.id_estado,
						beneficiarios: proyecto.beneficiarios ? Number(proyecto.beneficiarios) : null,
						fecha_fin_tentativa: proyecto.fecha_fin_tentativa
							? new Date(proyecto.fecha_fin_tentativa)
							: null
					}
				});
				// 3. Registrar categorías
				const proyectoCategoriaRepo = new ProyectoCategoriaRepoPrisma();
				const categoriaRepo = new PostgresCategoriaRepository();
				const registrarCategorias = new RegistrarCategoriasDeProyecto(
					proyectoCategoriaRepo,
					categoriaRepo
				);

				await registrarCategorias.execute(
					{
						proyectoId: created.id_proyecto,
						categoriaIds: (proyecto.categorias || []).map((c) => c.id_categoria!)
					},
					tx
				);

				// 4. Crear participaciones permitidas
				if (proyecto.participacion_permitida && proyecto.participacion_permitida.length > 0) {
					// Pre-buscar todos los tipos de participación necesarios para evitar N+1
					const descripciones = proyecto.participacion_permitida
						.map((p) => p.tipo_participacion?.descripcion)
						.filter((d): d is TipoParticipacionDescripcion => !!d);

					const tiposRepo = await tx.tipoParticipacion.findMany({
						where: { descripcion: { in: descripciones as any } }
					});

					for (const p of proyecto.participacion_permitida) {
						let tipoId = p.id_tipo_participacion;

						if (!tipoId && p.tipo_participacion?.descripcion) {
							tipoId = tiposRepo.find(
								(t) => t.descripcion === p.tipo_participacion?.descripcion
							)?.id_tipo_participacion;
						}

						if (tipoId) {
							await tx.participacionPermitida.create({
								data: {
									id_proyecto: created.id_proyecto,
									id_tipo_participacion: tipoId,
									objetivo: p.objetivo,
									unidad_medida: p.unidad_medida,
									especie: p.especie
								}
							});
						}
					}
				}

				// 5. Crear ubicaciones y vincularlas
				if (proyecto.ubicaciones && proyecto.ubicaciones.length > 0) {
					for (const pu of proyecto.ubicaciones) {
						if (pu.ubicacion) {
							const u = pu.ubicacion as any;
							const ubicacionCreada = await tx.ubicacion.create({
								data: {
									tipo_ubicacion: u.tipo_ubicacion,
									modalidad: u.modalidad,
									calle: u.calle,
									numero: u.numero,
									piso: u.piso,
									departamento: u.departamento,
									referencia: u.referencia,
									url_google_maps: u.url_google_maps,
									url_virtual: u.url_virtual,
									localidad_id: u.localidad_id
								}
							});

							await tx.proyectoUbicacion.create({
								data: {
									proyecto_id: created.id_proyecto,
									ubicacion_id: ubicacionCreada.id_ubicacion
								}
							});
						}
					}
				}

				// Retornar el proyecto completo con sus relaciones
				const finalProject = await tx.proyecto.findUnique({
					where: { id_proyecto: created.id_proyecto },
					include: this.includeOptions
				});

				if (!finalProject) throw new Error('Error al recuperar el proyecto creado');
				return finalProject;
			},
			{
				timeout: 20000 // Aumenté el timeout a 20 segundos ya que la petición demora
			}
		);

		return ProyectoMapper.toDomain(result as any);
	}

	async update(proyecto: Proyecto): Promise<Proyecto> {
		if (!proyecto.id_proyecto) throw new Error('ID de proyecto requerido para actualizar');

		const result = await prisma.$transaction(
			async (tx) => {
				// 1. Actualizar datos básicos del proyecto
				await tx.proyecto.update({
					where: { id_proyecto: proyecto.id_proyecto },
					data: {
						titulo: proyecto.titulo,
						descripcion: proyecto.descripcion,
						resumen: proyecto.resumen,
						aprendizajes: proyecto.aprendizajes,
						url_portada: proyecto.url_portada,
						fecha_fin_tentativa: proyecto.fecha_fin_tentativa
							? new Date(proyecto.fecha_fin_tentativa)
							: null,
						beneficiarios: proyecto.beneficiarios ? Number(proyecto.beneficiarios) : null,
						updated_at: new Date()
					}
				});

				// 2. Sincronizar categorías
				// Eliminar relaciones actuales
				await tx.proyectoCategoria.deleteMany({
					where: { proyecto_id: proyecto.id_proyecto }
				});

				// Crear nuevas relaciones
				if (proyecto.categorias && proyecto.categorias.length > 0) {
					await tx.proyectoCategoria.createMany({
						data: proyecto.categorias.map((c) => ({
							proyecto_id: proyecto.id_proyecto!,
							categoria_id: c.id_categoria!
						}))
					});
				}

				// 3. Sincronizar participaciones permitidas
				// Eliminar existentes
				await tx.participacionPermitida.deleteMany({
					where: { id_proyecto: proyecto.id_proyecto }
				});

				// Crear nuevas
				if (proyecto.participacion_permitida && proyecto.participacion_permitida.length > 0) {
					for (const p of proyecto.participacion_permitida) {
						let tipoId = p.id_tipo_participacion;

						// Si no tiene ID pero sí descripción, buscarlo (caso de creación/edición rápida)
						if (!tipoId && p.tipo_participacion?.descripcion) {
							const tipos = await tx.tipoParticipacion.findMany({
								where: { descripcion: p.tipo_participacion.descripcion }
							});
							tipoId = tipos[0]?.id_tipo_participacion;
						}

						if (tipoId) {
							await tx.participacionPermitida.create({
								data: {
									id_proyecto: proyecto.id_proyecto!,
									id_tipo_participacion: tipoId,
									objetivo: p.objetivo,
									unidad_medida: p.unidad_medida,
									especie: p.especie
								}
							});
						}
					}
				}

				// 4. Sincronizar ubicaciones
				const ubicacionesEnPayload = proyecto.ubicaciones || [];
				const idsUbicacionNuevos = ubicacionesEnPayload
					.map((u) => u.id_proyecto_ubicacion)
					.filter(Boolean) as number[];

				// a. Obtener relaciones actuales
				const relacionesActuales = await tx.proyectoUbicacion.findMany({
					where: { proyecto_id: proyecto.id_proyecto },
					select: { id_proyecto_ubicacion: true, ubicacion_id: true }
				});

				// b. Identificar relaciones a eliminar (las que no están en el payload)
				const relacionesAEliminar = relacionesActuales.filter(
					(rel) => !idsUbicacionNuevos.includes(rel.id_proyecto_ubicacion!)
				);

				if (relacionesAEliminar.length > 0) {
					const idsRelEliminar = relacionesAEliminar.map((r) => r.id_proyecto_ubicacion!);
					const idsUbiEliminar = relacionesAEliminar.map((r) => r.ubicacion_id);

					// Borrar relaciones
					await tx.proyectoUbicacion.deleteMany({
						where: { id_proyecto_ubicacion: { in: idsRelEliminar } }
					});

					// Borrar las ubicaciones físicas asociadas
					await tx.ubicacion.deleteMany({
						where: { id_ubicacion: { in: idsUbiEliminar } }
					});
				}

				// c. Procesar cada ubicación del payload (Update o Create)
				for (const pu of ubicacionesEnPayload) {
					const uData = pu.ubicacion as any;
					if (!uData) continue;

					const mappingData = {
						tipo_ubicacion: uData.tipo_ubicacion,
						modalidad: uData.modalidad,
						calle: uData.calle || null,
						numero: uData.numero || null,
						piso: uData.piso || null,
						departamento: uData.departamento || null,
						referencia: uData.referencia || null,
						url_google_maps: uData.url_google_maps || null,
						url_virtual: uData.url_virtual || null,
						localidad_id: uData.localidad_id || null
					};

					if (pu.id_proyecto_ubicacion) {
						// Es una actualización
						const relacionExistente = relacionesActuales.find(
							(r) => r.id_proyecto_ubicacion === pu.id_proyecto_ubicacion
						);
						if (relacionExistente) {
							await tx.ubicacion.update({
								where: { id_ubicacion: relacionExistente.ubicacion_id },
								data: mappingData
							});
						}
					} else {
						// Es una creación nueva
						const nuevaUbicacion = await tx.ubicacion.create({
							data: mappingData
						});

						await tx.proyectoUbicacion.create({
							data: {
								proyecto_id: proyecto.id_proyecto!,
								ubicacion_id: nuevaUbicacion.id_ubicacion
							}
						});
					}
				}

				// Retornar el proyecto completo actualizado
				const finalProject = await tx.proyecto.findUnique({
					where: { id_proyecto: proyecto.id_proyecto },
					include: this.includeOptions
				});

				return finalProject;
			},
			{ timeout: 30000 }
		);

		return ProyectoMapper.toDomain(result as any);
	}

	async updateEstado(id: number, nuevoEstado: EstadoDescripcion): Promise<Proyecto> {
		// Buscar el ID del estado basado en la descripción
		const estadoObj = await prisma.estado.findUnique({
			where: { descripcion: nuevoEstado }
		});

		if (!estadoObj) throw new Error(`Estado ${nuevoEstado} no encontrado`);

		const updated = await prisma.proyecto.update({
			where: { id_proyecto: id },
			data: {
				estado_id: estadoObj.id_estado
			},
			include: this.includeOptions
		});
		return ProyectoMapper.toDomain(updated as any);
	}

	async cancel(id: number, usuarioEjecutorId: number, justificacion?: string): Promise<void> {
		const estadoCancelado = await prisma.estado.findUnique({
			where: { descripcion: 'cancelado' }
		});

		if (!estadoCancelado) throw new Error('Estado "cancelado" no encontrado');

		const proyectoAnterior = await prisma.proyecto.findUnique({
			where: { id_proyecto: id },
			include: { estado: true }
		});

		if (!proyectoAnterior) throw new Error('Proyecto no encontrado');

		await prisma.$transaction(async (tx) => {
			// 1. Actualizar el estado del proyecto
			await tx.proyecto.update({
				where: { id_proyecto: id },
				data: {
					estado_id: estadoCancelado.id_estado
				}
			});

			// 2. Registrar en el historial de cambios
			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'proyecto',
					id_objeto: id,
					accion: 'cancelacion',
					atributo_afectado: 'estado',
					valor_anterior: proyectoAnterior.estado?.descripcion || 'desconocido',
					valor_nuevo: 'cancelado',
					justificacion:
						justificacion ||
						(usuarioEjecutorId === proyectoAnterior.institucion_id
							? 'Cancelación manual por la institución'
							: 'Cancelación administrativa por irregularidad'),
					usuario_id: usuarioEjecutorId
				}
			});
		});
	}
}
