import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { ParticipacionPermitida } from '$lib/domain/entities/ParticipacionPermitida';
import type { InstitucionDashboardData } from '$lib/components/dashboard/institucion/types';
import type { Colaboracion } from '$lib/domain/entities/Colaboracion';
import type { Proyecto } from '$lib/domain/entities/Proyecto';
import type { Usuario } from '$lib/domain/entities/Usuario';
import type { EstadoVerificacion, Verificacion } from '$lib/domain/types/Verificacion';
import { esArcaVigente } from '$lib/domain/types/Verificacion';
import { ESTADO_LABELS, ESTADOS_ACTIVOS_PROYECTO } from '$lib/domain/types/Estado';
import { obtenerNombreCompleto } from '$lib/utils/util-usuarios';
import { getColorEstadoHex } from '$lib/utils/util-estados';
import { obtenerUltimaVerificacion } from '$lib/utils/util-verificacion';

export class ObtenerDashboardInstitucion {
	constructor(
		private proyectoRepo: ProyectoRepository,
		private colaboracionRepo: ColaboracionRepository,
		private usuarioRepo: UsuarioRepository,
		private resenaRepo: ResenaRepository
	) { }

	private obtenerEstadoVerificacionActual(institucion: Usuario): EstadoVerificacion | null {
		const verificacionesGlobales = (institucion.verificaciones ?? []).filter(
			(v) => v.tipo !== 'arca'
		);
		const ultima = obtenerUltimaVerificacion(verificacionesGlobales);
		if (ultima?.estado === 'aprobada') return 'aprobada';
		if (ultima?.estado === 'pendiente') return 'pendiente';
		if (ultima?.estado === 'rechazada') return 'rechazada';
		return (institucion.estado_verificacion as EstadoVerificacion | null) ?? null;
	}

	private obtenerMetaVerificacion(institucion: Usuario): {
		estado: EstadoVerificacion | null;
		requiereVerificacionDocumental: boolean;
		documentacionVerificacionEnRevision: boolean;
	} {
		const estado = this.obtenerEstadoVerificacionActual(institucion);
		const tieneSolicitudVerificacion = (institucion.verificaciones ?? []).some(
			(v) => v.tipo !== 'arca'
		);
		const requiereVerificacionDocumental = !tieneSolicitudVerificacion && estado !== 'aprobada';
		const documentacionVerificacionEnRevision = estado === 'pendiente' && tieneSolicitudVerificacion;

		return {
			estado,
			requiereVerificacionDocumental,
			documentacionVerificacionEnRevision
		};
	}

	async execute(
		institucionId: number,
		opciones?: { desde?: Date | null }
	): Promise<InstitucionDashboardData> {
		const desde = opciones?.desde ?? null;

		const [institucion, proyectos] = await Promise.all([
			this.usuarioRepo.findById(institucionId),
			this.proyectoRepo.findByInstitucionId(institucionId)
		]);

		if (!institucion) {
			throw new Error('Institución no encontrada');
		}

		const colaboracionesPromises = proyectos.map((p) =>
			p.id_proyecto ? this.colaboracionRepo.findByProyecto(p.id_proyecto) : Promise.resolve([])
		);
		const colaboracionesPorProyecto = await Promise.all(colaboracionesPromises);
		const todasColaboraciones = colaboracionesPorProyecto.flat() as Colaboracion[];

		const colaboracionesAprobadas = todasColaboraciones.filter((c: Colaboracion) =>
			c.estaAprobada()
		);
		const colaboracionesPendientes = todasColaboraciones.filter((c: Colaboracion) =>
			c.estaPendiente()
		);

		// Filtros por período
		const proyectosEnPeriodo = desde
			? proyectos.filter((p) => p.created_at && new Date(p.created_at) >= desde)
			: proyectos;

		const colaboracionesAprobadasEnPeriodo = desde
			? colaboracionesAprobadas.filter((c) => c.created_at && c.created_at >= desde)
			: colaboracionesAprobadas;

		const hoy = new Date();
		const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
		const proyectosNuevosEsteMes = proyectos.filter(
			(p) => p.created_at && new Date(p.created_at) >= inicioMes
		).length;

		const proyectosConFecha = proyectos.filter(
			(p) => p.fecha_fin_tentativa && ESTADOS_ACTIVOS_PROYECTO.includes(p.estado as any)
		);
		const proximoCierre = proyectosConFecha.reduce(
			(min, p) => {
				if (!p.fecha_fin_tentativa) return min;
				const fecha = new Date(p.fecha_fin_tentativa);
				if (fecha > hoy && (!min || fecha < min)) return fecha;
				return min;
			},
			null as Date | null
		);

		const diasProximoCierre = proximoCierre
			? Math.ceil((proximoCierre.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
			: -1;

		const proyectosPendienteCierre = proyectos.filter(
			(p) => p.estado === 'pendiente_solicitud_cierre'
		).length;

		const {
			estado: estadoVerificacion,
			requiereVerificacionDocumental,
			documentacionVerificacionEnRevision
		} = this.obtenerMetaVerificacion(institucion);
		const estaVerificado = estadoVerificacion === 'aprobada';

		// Filtrado por período: card de colaboradores activos
		const colaboradoresUnicos = new Set(
			colaboracionesAprobadasEnPeriodo.map((c) => c.colaborador_id).filter(Boolean)
		);

		// Filtrados por período: card de proyectos + modal, card de colaboradores + modal, torta, top colaboradores
		const estadisticasProyectos = this.calcularEstadisticasProyectos(
			proyectosEnPeriodo,
			colaboracionesAprobadasEnPeriodo
		);
		const estadisticasColaboradores = await this.calcularEstadisticasColaboradores(
			proyectos,
			colaboracionesAprobadasEnPeriodo
		);
		const estadisticasAyuda = this.calcularEstadisticasAyuda(
			colaboracionesAprobadasEnPeriodo,
			proyectosEnPeriodo
		);
		const topColaboradores = await this.calcularTopColaboradores(colaboracionesAprobadasEnPeriodo);

		// Sin filtrar: agenda, seguimiento objetivos, actividad reciente, reseñas, aspectos a mejorar
		const estadisticasCalendario = this.calcularEstadisticasCalendario(proyectos, institucion);
		const seguimientoObjetivos = this.calcularSeguimientoObjetivos(proyectos);
		const actividadReciente = this.obtenerActividadReciente(proyectos, todasColaboraciones);
		const ultimasResenas = await this.obtenerUltimasResenas(institucionId);
		const aspectosMejorar = this.generarAspectosMejorar(proyectos);

		const proyectosParaEvidencia = proyectos
			.filter((p) => p.estado === 'en_curso' || p.estado === 'pendiente_solicitud_cierre')
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: p.titulo,
				estado: ESTADO_LABELS[p.estado as keyof typeof ESTADO_LABELS] ?? p.estado ?? 'Desconocido'
			}));

		return {
			info: {
				nombre: (institucion as any).nombre_legal || institucion.nombre || 'Institución',
				tipo: (institucion as any).tipo_institucion || 'Organización',
				fecha: new Date().toLocaleDateString('es-AR', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}),
				ubicacion:
					institucion.localidad?.nombre && institucion.localidad?.provincia?.nombre
						? `${institucion.localidad.nombre}, ${institucion.localidad.provincia.nombre}`
						: (institucion as any).domicilio_legal || 'Sin ubicación',
				estaVerificado,
				estadoVerificacion,
				requiereVerificacionDocumental,
				documentacionVerificacionEnRevision,
				bio: institucion.descripcion || 'Sin descripción disponible.'
			},
			metricas: {
				proyectosTotales: proyectosEnPeriodo.length,
				nuevosProyectos: proyectosNuevosEsteMes,
				colaboradoresActivos: colaboradoresUnicos.size,
				diasProximoCierre,
				solicitudesPendientes: colaboracionesPendientes.length,
				mensajesNoLeidos: 0,
				proyectosPendienteCierre,
				estadisticasProyectos,
				estadisticasCalendario,
				estadisticasColaboradores
			},
			seguimientoObjetivos,
			estadisticasAyuda,
			topColaboradores,
			actividadReciente,
			ultimasResenas,
			aspectosMejorar,
			proyectosParaEvidencia
		};
	}

	private calcularEstadisticasProyectos(proyectos: Proyecto[], colaboraciones: Colaboracion[]) {
		const totalDineroRecaudado = colaboraciones.reduce((total, colab) => {
			if (!colab.colaboraciones_tipo_participacion) return total;

			const aportesMonetarios = colab.colaboraciones_tipo_participacion
				.filter((ctp: any) => {
					const tipo = ctp.participacion_permitida?.tipo_participacion?.descripcion?.toLowerCase();
					return tipo === 'monetaria';
				})
				.reduce((sum: number, ctp: any) => sum + (Number(ctp.cantidad) || 0), 0);

			return total + aportesMonetarios;
		}, 0);

		const totalBeneficiarios = proyectos.reduce(
			(sum, p) => sum + (Number(p.beneficiarios) || 0),
			0
		);

		const proyectosConProgreso = proyectos.filter(
			(p) => p.participacion_permitida && p.participacion_permitida.length > 0
		);

		const promedioProgreso =
			proyectosConProgreso.length > 0
				? proyectosConProgreso.reduce((sum, p) => {
					const progreso = (p.participacion_permitida || []).reduce(
						(total: number, pp: ParticipacionPermitida) => {
							const objetivo = Number(pp.objetivo) || 0;
							const actual = Number(pp.actual) || 0;
							return total + (objetivo > 0 ? (actual / objetivo) * 100 : 0);
						},
						0
					);
					return sum + progreso / ((p.participacion_permitida || []).length || 1);
				}, 0) / proyectosConProgreso.length
				: 0;

		const proyectosEnAuditoria = proyectos
			.filter((p) => p.estado === 'en_auditoria')
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: p.titulo,
				motivo: 'En proceso de auditoría',
				fecha: p.updated_at
					? new Date(p.updated_at).toLocaleDateString('es-AR')
					: new Date().toLocaleDateString('es-AR')
			}));

		const distribucionEstado = this.calcularDistribucionEstado(proyectos);
		const distribucionCategoria = this.calcularDistribucionCategoria(proyectos);

		const proyectosDestacados = proyectos
			.filter((p) => p.estado === 'en_curso' || p.estado === 'en_revision')
			.sort((a, b) => {
				const progresoA = this.calcularProgresoProyecto(a);
				const progresoB = this.calcularProgresoProyecto(b);
				return progresoB - progresoA;
			})
			.slice(0, 3)
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: p.titulo,
				estado: ESTADO_LABELS[p.estado as keyof typeof ESTADO_LABELS] ?? p.estado ?? 'Desconocido',
				progreso: Math.round(this.calcularProgresoProyecto(p)),
				beneficiarios: Number(p.beneficiarios) || 0,
				imagen: p.url_portada || undefined
			}));

		return {
			totalDineroRecaudado,
			totalBeneficiarios,
			promedioProgreso: Math.round(promedioProgreso),
			proyectosEnAuditoria,
			distribucionEstado,
			distribucionCategoria,
			proyectosDestacados
		};
	}

	private calcularProgresoProyecto(proyecto: Proyecto): number {
		if (!proyecto.participacion_permitida || proyecto.participacion_permitida.length === 0) {
			return 0;
		}

		const progreso = proyecto.participacion_permitida.reduce(
			(total: number, pp: ParticipacionPermitida) => {
				const objetivo = Number(pp.objetivo) || 0;
				const actual = Number(pp.actual) || 0;
				return total + (objetivo > 0 ? (actual / objetivo) * 100 : 0);
			},
			0
		);

		return progreso / proyecto.participacion_permitida.length;
	}

	private calcularDistribucionEstado(proyectos: Proyecto[]) {
		const conteos = proyectos.reduce(
			(acc, p) => {
				const estado = p.estado || 'desconocido';
				acc[estado] = (acc[estado] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const total = proyectos.length || 1;

		const ordenEstados = ['en_curso', 'pendiente_solicitud_cierre', 'en_revision', 'completado', 'cancelado', 'en_auditoria'];

		return ordenEstados.map((estado) => ({
			label: ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS] ?? estado,
			count: conteos[estado] || 0,
			percentage: Math.round(((conteos[estado] || 0) / total) * 100),
			color: getColorEstadoHex(estado)
		}));
	}

	private calcularDistribucionCategoria(proyectos: Proyecto[]) {
		const categorias = new Map<string, number>();

		proyectos.forEach((p) => {
			if (p.categorias && Array.isArray(p.categorias)) {
				p.categorias.forEach((cat) => {
					const categoria = cat.descripcion || 'Otra';
					categorias.set(categoria, (categorias.get(categoria) || 0) + 1);
				});
			}
		});

		const total = Array.from(categorias.values()).reduce((a, b) => a + b, 0) || 1;
		const sortedCategories = Array.from(categorias.entries()).sort((a, b) => b[1] - a[1]);

		const top3 = sortedCategories.slice(0, 3).map(([label, count]) => ({
			label,
			count,
			percentage: Math.round((count / total) * 100)
		}));

		const otrosCount = sortedCategories.slice(3).reduce((sum, [, count]) => sum + count, 0);

		if (otrosCount > 0) {
			top3.push({
				label: 'Otros',
				count: otrosCount,
				percentage: Math.round((otrosCount / total) * 100)
			});
		}

		return top3;
	}

	private calcularEstadisticasCalendario(proyectos: Proyecto[], institucion: Usuario) {
		const hoy = new Date();

		// Estado del certificado ARCA (RG 2681):
		const arcasAprobadas = ((institucion.verificaciones ?? []) as Verificacion[]).filter(
			(v) => v.tipo === 'arca' && v.estado === 'aprobada' && v.fecha_vencimiento
		);
		const arcaMasReciente = arcasAprobadas.sort(
			(a, b) =>
				new Date(b.fecha_vencimiento!).getTime() - new Date(a.fecha_vencimiento!).getTime()
		)[0];

		let verificacion: {
			estado: 'vigente' | 'vencido' | 'sin_registro';
			fechaRenovacion: string | null;
			diasRestantes: number | null;
		};

		if (arcaMasReciente && esArcaVigente(arcaMasReciente, hoy)) {
			const fechaVenc = new Date(arcaMasReciente.fecha_vencimiento!);
			verificacion = {
				estado: 'vigente',
				fechaRenovacion: fechaVenc.toISOString().split('T')[0],
				diasRestantes: Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
			};
		} else if (arcaMasReciente) {
			verificacion = {
				estado: 'vencido',
				fechaRenovacion: new Date(arcaMasReciente.fecha_vencimiento!).toISOString().split('T')[0],
				diasRestantes: null
			};
		} else {
			verificacion = {
				estado: 'sin_registro',
				fechaRenovacion: null,
				diasRestantes: null
			};
		}

		const projectTimeline = proyectos
			.filter((p) => p.created_at && p.fecha_fin_tentativa)
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: p.titulo,
				fechaInicio:
					p.created_at instanceof Date
						? p.created_at.toISOString().split('T')[0]
						: (p.created_at as string),
				fechaFin:
					p.fecha_fin_tentativa instanceof Date
						? p.fecha_fin_tentativa.toISOString().split('T')[0]
						: (p.fecha_fin_tentativa as string),
				estado: p.estado || 'desconocido',
				color: getColorEstadoHex(p.estado || '')
			}));

		const proximosVencimientos = proyectos
			.filter((p) => p.fecha_fin_tentativa && ESTADOS_ACTIVOS_PROYECTO.includes(p.estado as any))
			.map((p) => {
				const fechaFin = new Date(p.fecha_fin_tentativa as string);
				return {
					id: p.id_proyecto?.toString() || '',
					titulo: `Cierre: ${p.titulo}`,
					fecha: (p.fecha_fin_tentativa
						? p.fecha_fin_tentativa instanceof Date
							? p.fecha_fin_tentativa.toISOString().split('T')[0]
							: new Date(p.fecha_fin_tentativa as string).toISOString().split('T')[0]
						: '') as string,
					tipo: 'finalizacion_proyecto' as const,
					diff: fechaFin.getTime() - hoy.getTime()
				};
			})
			.filter((v) => v.diff > 0)
			.sort((a, b) => a.diff - b.diff)
			.slice(0, 5)
			.map(({ diff, ...rest }) => rest);

		return {
			verificacion,
			projectTimeline: projectTimeline as any,
			proximosVencimientos: proximosVencimientos as any
		};
	}

	private async calcularEstadisticasColaboradores(
		proyectos: Proyecto[],
		colaboraciones: Colaboracion[]
	) {
		const colaboradoresUnicosIds = new Set(
			colaboraciones.map((c) => c.colaborador_id).filter(Boolean)
		);

		const hoy = new Date();
		const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

		const nuevosEsteMes = colaboraciones.filter(
			(c) => c.created_at && new Date(c.created_at) >= inicioMes
		);
		const colaboradoresNuevos = new Set(nuevosEsteMes.map((c) => c.colaborador_id));

		const categoriasCount = new Map<string, number>();
		const ubicacionCount = new Map<string, number>();
		const topColaboradoresMap = new Map<number, { count: number; proyectos: Set<number> }>();

		// Cargar datos detallados de colaboradores únicos (solo ubicación; las categorías
		// se cuentan desde los proyectos colaborados, no desde el perfil del usuario)
		await Promise.all(
			Array.from(colaboradoresUnicosIds).map(async (id) => {
				if (!id) return;
				try {
					const usuario = await this.usuarioRepo.findById(id);
					if (!usuario) return;

					if (usuario.localidad) {
						const loc = usuario.localidad.nombre;
						const prov = usuario.localidad.provincia?.nombre;
						const ubicacion = prov ? `${loc}, ${prov}` : loc;
						ubicacionCount.set(ubicacion, (ubicacionCount.get(ubicacion) || 0) + 1);
					}
				} catch (e) {
					console.error(`Error al cargar datos del colaborador ${id}:`, e);
				}
			})
		);

		// Distribución por categorías: cuenta 1 por cada par (colaboración aprobada,
		// categoría del proyecto colaborado). Un proyecto con N categorías suma N veces.
		const categoriasPorProyecto = new Map<number, string[]>();
		for (const p of proyectos) {
			if (p.id_proyecto == null) continue;
			const cats = ((p as any).categorias ?? [])
				.map((c: any) => c.descripcion)
				.filter((d: any): d is string => typeof d === 'string' && d.length > 0);
			if (cats.length > 0) categoriasPorProyecto.set(p.id_proyecto, cats);
		}

		for (const c of colaboraciones) {
			if (c.proyecto_id == null) continue;
			const cats = categoriasPorProyecto.get(c.proyecto_id);
			if (!cats) continue;
			for (const cat of cats) {
				categoriasCount.set(cat, (categoriasCount.get(cat) || 0) + 1);
			}
		}

		// Calcular Distribución de Categorías (Top 3 + Otros)
		const totalCategorias = Array.from(categoriasCount.values()).reduce((a, b) => a + b, 0) || 1;
		const sortedCategorias = Array.from(categoriasCount.entries()).sort((a, b) => b[1] - a[1]);

		const distribucionCategorias = sortedCategorias.slice(0, 3).map(([label, count]) => ({
			label,
			count,
			percentage: Math.round((count / totalCategorias) * 100)
		}));

		const otrosCategoriasCount = sortedCategorias
			.slice(3)
			.reduce((sum, [, count]) => sum + count, 0);

		if (otrosCategoriasCount > 0) {
			distribucionCategorias.push({
				label: 'Otros',
				count: otrosCategoriasCount,
				percentage: Math.round((otrosCategoriasCount / totalCategorias) * 100)
			});
		}

		// Calcular Distribución de Ubicación (Top 3 + Otros)
		const totalUbicaciones = Array.from(ubicacionCount.values()).reduce((a, b) => a + b, 0) || 1;
		const sortedUbicaciones = Array.from(ubicacionCount.entries()).sort((a, b) => b[1] - a[1]);

		const distribucionUbicacion = sortedUbicaciones.slice(0, 3).map(([label, count]) => ({
			label,
			count,
			percentage: Math.round((count / totalUbicaciones) * 100)
		}));

		const otrosUbicacionCount = sortedUbicaciones
			.slice(3)
			.reduce((sum, [, count]) => sum + count, 0);

		if (otrosUbicacionCount > 0) {
			distribucionUbicacion.push({
				label: 'Otros',
				count: otrosUbicacionCount,
				percentage: Math.round((otrosUbicacionCount / totalUbicaciones) * 100)
			});
		}

		// Calcular Top Colaboradores (basado en colaboraciones)
		colaboraciones.forEach((c) => {
			if (!c.colaborador_id) return;
			const current = topColaboradoresMap.get(c.colaborador_id) || {
				count: 0,
				proyectos: new Set()
			};
			current.count++;
			if (c.proyecto_id) current.proyectos.add(c.proyecto_id);
			topColaboradoresMap.set(c.colaborador_id, current);
		});

		const topColaboradoresIds = Array.from(topColaboradoresMap.entries())
			.sort((a, b) => b[1].count - a[1].count)
			.slice(0, 5);

		const topColaboradores = await Promise.all(
			topColaboradoresIds.map(async ([id, data]) => {
				const usuario = await this.usuarioRepo.findById(id);
				return {
					id: id.toString(),
					nombre: usuario ? obtenerNombreCompleto(usuario) : 'Usuario desconocido',
					username: usuario?.username || '',
					rol:
						(usuario as any)?.tipo_colaborador === 'organizacion' ? 'Organización' : 'Voluntario/a',
					avatarUrl: (usuario as any)?.url_foto || '',
					aportes: data.count.toString(),
					proyectos: data.proyectos.size
				};
			})
		);

		// Tasa de retención: % de colaboradores únicos con ≥2 colaboraciones aprobadas
		const conteoPorColaborador = new Map<number, number>();
		for (const c of colaboraciones) {
			if (c.colaborador_id == null) continue;
			conteoPorColaborador.set(
				c.colaborador_id,
				(conteoPorColaborador.get(c.colaborador_id) || 0) + 1
			);
		}
		const totalUnicosRetencion = conteoPorColaborador.size;
		const recurrentes = Array.from(conteoPorColaborador.values()).filter((n) => n >= 2).length;
		const retencion =
			totalUnicosRetencion > 0 ? Math.round((recurrentes / totalUnicosRetencion) * 100) : 0;

		return {
			totalActivos: colaboradoresUnicosIds.size,
			nuevosEsteMes: colaboradoresNuevos.size,
			retencion,
			distribucionCategorias,
			distribucionUbicacion,
			topColaboradores
		};
	}

	private calcularSeguimientoObjetivos(proyectos: Proyecto[]) {
		return proyectos
			.filter(
				(p) =>
					(p.estado === 'en_curso' || p.estado === 'pendiente_solicitud_cierre') &&
					p.participacion_permitida &&
					p.participacion_permitida.length > 0
			)
			.slice(0, 5)
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				nombre: p.titulo,
				fechaFin:
					p.fecha_fin_tentativa instanceof Date
						? p.fecha_fin_tentativa.toISOString().split('T')[0]
						: (p.fecha_fin_tentativa as string) || '',
				objetivos: (p.participacion_permitida || []).map((pp: ParticipacionPermitida) => {
					const objetivo = Number(pp.objetivo) || 0;
					const actual = Number(pp.actual) || 0;
					const progreso = objetivo > 0 ? Math.round((actual / objetivo) * 100) : 0;
					const tipo = pp.tipo_participacion?.descripcion?.toLowerCase() || 'otro';

					return {
						id: pp.id_participacion_permitida?.toString() || '',
						descripcion: pp.tipo_participacion?.descripcion || 'Sin descripción',
						tipo: (tipo === 'monetaria' || tipo === 'voluntariado' || tipo === 'especie'
							? tipo
							: 'especie') as 'monetaria' | 'voluntariado' | 'especie',
						progreso,
						actual,
						meta: objetivo,
						unidad: pp.unidad_medida || 'unidades',
						especie: pp.especie
					};
				})
			}));
	}

	private calcularEstadisticasAyuda(colaboraciones: Colaboracion[], proyectos: Proyecto[]) {
		let voluntariado = 0;
		let monetaria = 0;
		let especie = 0;

		// Iterar sobre los proyectos para contar qué tipo de ayuda solicitan (participación permitida)
		proyectos.forEach((p) => {
			if (p.participacion_permitida) {
				p.participacion_permitida.forEach((pp: any) => {
					const tipo = pp.tipo_participacion?.descripcion?.toLowerCase();
					if (tipo === 'voluntariado') {
						voluntariado++;
					} else if (tipo === 'monetaria') {
						monetaria++;
					} else if (tipo === 'especie') {
						especie++;
					}
				});
			}
		});

		const totalBeneficiarios = proyectos.reduce(
			(sum, p) => sum + (Number(p.beneficiarios) || 0),
			0
		);

		return {
			voluntariado,
			monetaria,
			especie,
			totalBeneficiarios
		};
	}

	private async calcularTopColaboradores(colaboraciones: any[]) {
		const colaboradoresMap = new Map<number, number>();

		colaboraciones.forEach((c) => {
			if (!c.colaborador_id) return;
			colaboradoresMap.set(c.colaborador_id, (colaboradoresMap.get(c.colaborador_id) || 0) + 1);
		});

		const topIds = Array.from(colaboradoresMap.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);

		const topColaboradores = await Promise.all(
			topIds.map(async ([id, aportes]) => {
				const usuario = await this.usuarioRepo.findById(id);
				return {
					id: id.toString(),
					nombre: usuario ? obtenerNombreCompleto(usuario) : 'Usuario desconocido',
					username: usuario?.username || '',
					avatarUrl: (usuario as any)?.url_foto || undefined,
					aportes,
					rol:
						(usuario as any)?.tipo_colaborador === 'organizacion' ? 'Organización' : 'Voluntario/a'
				};
			})
		);

		return topColaboradores;
	}

	private obtenerActividadReciente(proyectos: any[], colaboraciones: any[]) {
		// Unificar eventos manteniendo la fecha como Date, ordenar desc por fecha,
		// recortar a 4 y recién entonces formatear para display.
		type Evento = {
			id: string;
			titulo: string;
			descripcion: string;
			fechaDate: Date;
			tipo: 'proyecto' | 'colaboracion';
		};

		const eventos: Evento[] = [];

		for (const p of proyectos) {
			if (!p.created_at) continue;
			eventos.push({
				id: `proyecto-${p.id_proyecto}`,
				titulo: 'Nuevo proyecto creado',
				descripcion: `Se ha publicado correctamente "${p.titulo}".`,
				fechaDate: new Date(p.created_at),
				tipo: 'proyecto'
			});
		}

		for (const c of colaboraciones) {
			if (!c.created_at) continue;
			eventos.push({
				id: `colaboracion-${c.id_colaboracion}`,
				titulo: 'Colaboración recibida',
				descripcion: 'Se ha recibido una nueva colaboración.',
				fechaDate: new Date(c.created_at),
				tipo: 'colaboracion'
			});
		}

		return eventos
			.sort((a, b) => b.fechaDate.getTime() - a.fechaDate.getTime())
			.slice(0, 4)
			.map(({ fechaDate, ...rest }) => ({
				...rest,
				fecha: this.formatearFechaRelativa(fechaDate)
			}));
	}

	private formatearFechaRelativa(fecha: Date): string {
		const ahora = new Date();
		const diff = ahora.getTime() - fecha.getTime();
		const horas = Math.floor(diff / (1000 * 60 * 60));
		const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (horas < 1) return 'Hace unos minutos';
		if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
		if (dias === 1) return 'Ayer';
		if (dias < 7) return `Hace ${dias} días`;
		return fecha.toLocaleDateString('es-AR');
	}

	private async obtenerUltimasResenas(institucionId: number) {
		const resenas = await this.resenaRepo.findByObjetoAprobadas('usuario', institucionId, 5);

		return resenas.map((r) => ({
			id: r.id_resena?.toString() || '',
			usuario: r.username || 'Usuario anónimo',
			avatarUrl: r.autor?.url_foto ?? undefined,
			calificacion: r.puntaje || 0,
			comentario: r.contenido || '',
			fecha: r.created_at?.toISOString() ?? new Date().toISOString()
		}));
	}

	private generarAspectosMejorar(proyectos: Proyecto[]) {
		const proyectosConAprendizajes = proyectos
			.filter(
				(p) => p.estado === 'completado' && p.aprendizajes && p.aprendizajes.trim().length > 0
			)
			.sort((a, b) => {
				const fechaA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
				const fechaB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
				return fechaB - fechaA;
			})
			.slice(0, 2);

		return proyectosConAprendizajes.map((p) => {
			const aprendizajesTexto = p.aprendizajes || '';

			const sugerencias = aprendizajesTexto
				.split(/\n+/)
				.map((linea) => linea.trim())
				.filter((linea) => linea.length > 0)
				.map((linea) => {
					linea = linea.replace(/^[-•*]\s*/, '');
					return linea;
				})
				.filter((linea) => linea.length > 0);

			return {
				id: p.id_proyecto?.toString() || '',
				proyecto: p.titulo,
				sugerencias: sugerencias.length > 0 ? sugerencias : [aprendizajesTexto]
			};
		});
	}
}
