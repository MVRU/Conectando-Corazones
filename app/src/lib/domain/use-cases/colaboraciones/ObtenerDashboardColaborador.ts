import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import type { ColaboradorDashboardData } from '$lib/components/dashboard/colaborador/types';

export class ObtenerDashboardColaborador {
	constructor(
		private colaboracionRepo: ColaboracionRepository,
		private proyectoRepo: ProyectoRepository,
		private usuarioRepo: UsuarioRepository
	) {}

	async execute(colaboradorId: number): Promise<ColaboradorDashboardData> {
		const [colaborador, colaboraciones, proyectos] = await Promise.all([
			this.usuarioRepo.findById(colaboradorId),
			this.colaboracionRepo.findByColaborador(colaboradorId),
			this.proyectoRepo.findByUsuarioId(colaboradorId)
		]);

		if (!colaborador) {
			throw new Error('Colaborador no encontrado');
		}

		const colaboracionesAprobadas = colaboraciones.filter((c) => c.estaAprobada());
		const colaboracionesPendientes = colaboraciones.filter((c) => c.estaPendiente());

		const proyectosColaborador = proyectos.filter((p) =>
			colaboraciones.some((c) => c.proyecto_id === p.id_proyecto && c.estaAprobada())
		);

		const institucionesUnicas = new Set(
			proyectosColaborador.map((p) => p.institucion_id).filter(Boolean)
		);

		const hoy = new Date();
		const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
		const institucionesNuevasEsteMes = new Set(
			proyectosColaborador
				.filter((p) => {
					const colabProyecto = colaboraciones.find(
						(c) => c.proyecto_id === p.id_proyecto && c.estaAprobada()
					);
					return colabProyecto?.created_at && colabProyecto.created_at >= inicioMes;
				})
				.map((p) => p.institucion_id)
				.filter(Boolean)
		);

		const proyectosConFecha = proyectosColaborador.filter((p) => p.fecha_fin_tentativa);
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
			: 0;

		const proyectosParaCierre = proyectosColaborador
			.filter((p) => {
				if (!p.fecha_fin_tentativa) return false;
				const fechaFin = new Date(p.fecha_fin_tentativa);
				const diff = fechaFin.getTime() - hoy.getTime();
				const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
				return dias >= 0 && dias <= 30 && p.estado === 'en_revision';
			})
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: p.titulo,
				fechaFin:
					(p.fecha_fin_tentativa instanceof Date
						? p.fecha_fin_tentativa.toISOString().split('T')[0]
						: p.fecha_fin_tentativa) || '',
				estado: p.estado || 'desconocido'
			}));

		const ubicacion = colaborador.localidad
			? `${colaborador.localidad.nombre}, ${colaborador.localidad.provincia?.nombre || ''}`
			: 'Sin ubicación';

		const tipoColaborador =
			colaborador.tipo_colaborador === 'unipersonal'
				? 'Voluntario/a'
				: colaborador.tipo_colaborador === 'organizacion'
					? colaborador.razon_social || 'Organización'
					: 'Colaborador/a';

		const estadisticasProyectos = this.calcularEstadisticasProyectos(
			proyectosColaborador,
			colaboraciones
		);
		const estadisticasCalendario = this.calcularEstadisticasCalendario(
			proyectosColaborador,
			colaborador
		);
		const estadisticasInstituciones = this.calcularEstadisticasInstituciones(
			proyectosColaborador,
			colaboraciones
		);
		const seguimientoObjetivos = this.calcularSeguimientoObjetivos(
			proyectosColaborador,
			colaboraciones
		);
		const estadisticasAyuda = this.calcularEstadisticasAyuda(colaboraciones);

		// Obtener proyectos recomendados
		const proyectosComunidad = await this.calcularProyectosRecomendados(
			colaborador,
			proyectosColaborador
		);

		return {
			info: {
				nombre: `${colaborador.nombre} ${colaborador.apellido}`,
				tipo: tipoColaborador,
				fecha: new Date().toLocaleDateString('es-AR', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}),
				ubicacion
			},
			metricas: {
				proyectosTotales: proyectosColaborador.length,
				institucionesAlcanzadas: institucionesUnicas.size,
				nuevasInstituciones: institucionesNuevasEsteMes.size,
				diasProximoCierre,
				solicitudesPendientes: colaboracionesPendientes.length,
				mensajesNoLeidos: 0,
				proyectosPendienteCierre: proyectosParaCierre.length,
				proyectosParaCierre,
				estadisticasProyectos,
				estadisticasCalendario,
				estadisticasInstituciones
			},
			seguimientoObjetivos,
			estadisticasAyuda,
			topColaboradores: [],
			ultimasResenas: [],
			heatmapActividad: [],
			proyectosComunidad
		};
	}

	private calcularEstadisticasProyectos(proyectos: any[], colaboraciones: any[]) {
		// Calcular total aportado en ARS desde colaboraciones_tipo_participacion
		// Calcular total aportado en ARS desde colaboraciones_tipo_participacion
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

		const distribucionEstado = this.calcularDistribucionEstado(proyectos);
		const distribucionCategoria = this.calcularDistribucionCategoria(proyectos);

		const proyectosConProgreso = proyectos.map((p) => {
			const progreso = this.calcularProgresoProyecto(p);
			return { ...p, progreso };
		});

		const promedioProgreso =
			proyectosConProgreso.length > 0
				? Math.round(
						proyectosConProgreso.reduce((sum, p) => sum + p.progreso, 0) /
							proyectosConProgreso.length
					)
				: 0;

		const proyectosDestacados = proyectosConProgreso
			.sort((a, b) => b.progreso - a.progreso)
			.slice(0, 3)
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: p.titulo,
				estado: p.estado || 'desconocido',
				progreso: p.progreso,
				beneficiarios: Number(p.beneficiarios) || 0,
				imagen: p.url_portada
			}));

		return {
			totalDineroRecaudado,
			totalBeneficiarios,
			promedioProgreso,
			proyectosEnAuditoria: [],
			distribucionEstado,
			distribucionCategoria,
			proyectosDestacados
		};
	}

	private calcularProgresoProyecto(proyecto: any): number {
		if (!proyecto.participacion_permitida || proyecto.participacion_permitida.length === 0) {
			return 0;
		}

		const progresos = proyecto.participacion_permitida.map((pp: any) => {
			const objetivo = pp.objetivo || 0;
			if (objetivo === 0) return 0;

			const actual =
				pp.colaboraciones_tipo_participacion?.reduce(
					(sum: number, ctp: any) => sum + (ctp.cantidad || 0),
					0
				) || 0;

			return Math.min((actual / objetivo) * 100, 100);
		});

		return progresos.length > 0
			? Math.round(progresos.reduce((sum: number, p: number) => sum + p, 0) / progresos.length)
			: 0;
	}

	private calcularDistribucionEstado(proyectos: any[]) {
		const estados = proyectos.reduce(
			(acc, p) => {
				const estado = p.estado || 'desconocido';
				acc[estado] = (acc[estado] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const total = proyectos.length || 1;
		const colores: Record<string, string> = {
			en_curso: '#3b82f6',
			pendiente_solicitud_cierre: '#f59e0b',
			en_revision: '#8b5cf6',
			completado: '#10b981'
		};

		const labels: Record<string, string> = {
			en_curso: 'En curso',
			pendiente_solicitud_cierre: 'Pendiente de cierre',
			en_revision: 'En revisión',
			completado: 'Completado'
		};

		// Orden específico de estados - siempre mostrar estos 4
		const ordenEstados = ['en_curso', 'pendiente_solicitud_cierre', 'en_revision', 'completado'];

		// Retornar siempre los 4 estados, incluso si tienen 0 proyectos
		return ordenEstados.map((estado) => ({
			label: labels[estado] || this.formatearEstado(estado),
			count: (estados[estado] as number) || 0,
			percentage: Math.round((((estados[estado] as number) || 0) / total) * 100),
			color: colores[estado] || '#6b7280'
		}));
	}

	private calcularDistribucionCategoria(proyectos: any[]) {
		const categorias = proyectos.reduce(
			(acc, p) => {
				p.categorias?.forEach((cat: any) => {
					const nombre = cat.descripcion || 'Sin categoría';
					acc[nombre] = (acc[nombre] || 0) + 1;
				});
				return acc;
			},
			{} as Record<string, number>
		);

		const total =
			Object.values(categorias).reduce((sum: number, count) => sum + (count as number), 0) || 1;

		return Object.entries(categorias).map(([label, count]) => ({
			label,
			count: count as number,
			percentage: Math.round(((count as number) / total) * 100)
		}));
	}

	private calcularEstadisticasCalendario(proyectos: any[], colaborador: any) {
		const hoy = new Date();

		const projectTimeline = proyectos
			.filter((p) => p.created_at && p.fecha_fin_tentativa)
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: p.titulo,
				fechaInicio: p.created_at,
				fechaFin: p.fecha_fin_tentativa || '',
				estado: p.estado || 'desconocido',
				color: this.getColorEstado(p.estado)
			}));

		const proximosVencimientos = proyectos
			.filter((p) => {
				if (!p.fecha_fin_tentativa) return false;
				const fechaFin = new Date(p.fecha_fin_tentativa);
				return fechaFin > hoy;
			})
			.sort((a, b) => {
				const fechaA = new Date(a.fecha_fin_tentativa!);
				const fechaB = new Date(b.fecha_fin_tentativa!);
				return fechaA.getTime() - fechaB.getTime();
			})
			.slice(0, 5)
			.map((p) => ({
				id: p.id_proyecto?.toString() || '',
				titulo: `Cierre: ${p.titulo}`,
				fecha: p.fecha_fin_tentativa || '',
				tipo: 'finalizacion_proyecto' as const
			}));

		return {
			verificacion: {
				estado: 'verificada' as const,
				fechaRenovacion: new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate())
					.toISOString()
					.split('T')[0],
				diasRestantes: 365
			},
			projectTimeline,
			proximosVencimientos
		};
	}

	private calcularEstadisticasInstituciones(proyectos: any[], colaboraciones: any[]) {
		const institucionesPorProyecto = proyectos.reduce(
			(acc, p) => {
				if (!p.institucion) return acc;

				const id = p.institucion.id_usuario?.toString() || '';
				const nombre = p.institucion.nombre_legal || p.institucion.username || 'Sin nombre';

				if (!acc[id]) {
					acc[id] = { id, nombre, cantidadProyectos: 0 };
				}
				acc[id].cantidadProyectos++;
				return acc;
			},
			{} as Record<string, { id: string; nombre: string; cantidadProyectos: number }>
		);

		type InstitucionData = { id: string; nombre: string; cantidadProyectos: number };
		const institucionesArray = (Object.values(institucionesPorProyecto) as InstitucionData[]).sort(
			(a, b) => b.cantidadProyectos - a.cantidadProyectos
		);

		const top3 = institucionesArray.slice(0, 3).map((inst, index) => ({
			...inst,
			ranking: index + 1
		}));

		const resto = institucionesArray.slice(3);

		// Calcular estadísticas de colaboraciones por estado
		const aprobadas = colaboraciones.filter((c) => c.estaAprobada()).length;
		const pendientes = colaboraciones.filter((c) => c.estaPendiente()).length;
		const rechazadas = colaboraciones.filter((c) => c.estaRechazada()).length;
		const total = colaboraciones.length;

		return {
			institucionesAyudadas: [...top3, ...resto],
			colaboraciones: {
				pendientes,
				aprobadas,
				rechazadas,
				total
			}
		};
	}

	private calcularSeguimientoObjetivos(proyectos: any[], colaboraciones: any[]) {
		return proyectos
			.filter((p) => p.participacion_permitida && p.participacion_permitida.length > 0)
			.slice(0, 3)
			.map((p) => {
				const objetivos = p.participacion_permitida.map((pp: any) => {
					const objetivo = pp.objetivo || 0;

					// Sumar TODAS las colaboraciones_tipo_participacion para esta participación permitida
					// Estas ya vienen filtradas por participación permitida desde la base de datos
					// Y ahora filtramos por estado de la colaboración (solo aprobadas)
					const actual =
						pp.colaboraciones_tipo_participacion
							?.filter(
								(ctp: any) =>
									ctp.colaboracion?.estado === 'approved' ||
									ctp.colaboracion?.estado === 'completed'
							) // Ajustar estados según lógica de negocio
							.reduce((sum: number, ctp: any) => sum + (Number(ctp.cantidad) || 0), 0) || 0;

					const progreso = objetivo > 0 ? Math.round((actual / objetivo) * 100) : 0;

					const tipoDescripcion = pp.tipo_participacion?.descripcion?.toLowerCase() || '';
					const tipo =
						tipoDescripcion === 'monetaria'
							? 'monetaria'
							: tipoDescripcion === 'voluntariado'
								? 'voluntariado'
								: 'especie';

					// Para tipo "Especie", mostrar la especie y unidad de medida
					let descripcion = pp.tipo_participacion?.descripcion || 'Sin descripción';
					if (tipo === 'especie' && pp.especie) {
						const unidadMedida = pp.unidad_medida || '';
						descripcion = `${pp.especie}${unidadMedida ? ` (${unidadMedida})` : ''}`;
					}

					return {
						id: pp.id_participacion_permitida?.toString() || '',
						descripcion,
						tipo,
						progreso: Math.min(progreso, 100),
						actual,
						meta: objetivo,
						unidad: pp.unidad_medida || 'unidades'
					};
				});

				return {
					id: p.id_proyecto?.toString() || '',
					nombre: p.titulo,
					fechaFin: p.fecha_fin_tentativa || '',
					objetivos
				};
			});
	}

	private calcularEstadisticasAyuda(colaboraciones: any[]) {
		const colaboracionesAprobadas = colaboraciones.filter((c) => c.estaAprobada());

		// Agrupar voluntariado por especie
		const voluntariadoPorEspecie = {
			horas: 0,
			dias: 0,
			persona: 0
		};

		let monetaria = 0;
		let especie = 0;

		const proyectosPorTipo = {
			voluntariado: new Set<number>(),
			monetaria: new Set<number>(),
			especie: new Set<number>()
		};

		colaboracionesAprobadas.forEach((c) => {
			c.colaboraciones_tipo_participacion?.forEach((ctp: any) => {
				const tipo = ctp.participacion_permitida?.tipo_participacion?.descripcion?.toLowerCase();
				const cantidad = ctp.cantidad || 0;
				const especieParticipacion =
					ctp.participacion_permitida?.especie?.toLowerCase() || 'persona';

				if (tipo === 'voluntariado') {
					// Agrupar por especie
					if (especieParticipacion === 'horas') {
						voluntariadoPorEspecie.horas += cantidad;
					} else if (especieParticipacion === 'dias' || especieParticipacion === 'días') {
						voluntariadoPorEspecie.dias += cantidad;
					} else {
						// Por defecto es "persona"
						voluntariadoPorEspecie.persona += cantidad;
					}
					if (c.proyecto_id) proyectosPorTipo.voluntariado.add(c.proyecto_id);
				} else if (tipo === 'monetaria') {
					monetaria += cantidad;
					if (c.proyecto_id) proyectosPorTipo.monetaria.add(c.proyecto_id);
				} else {
					especie += cantidad;
					if (c.proyecto_id) proyectosPorTipo.especie.add(c.proyecto_id);
				}
			});
		});

		// Determinar el mayor valor de voluntariado y su unidad
		let voluntariado = 0;
		let unidadVoluntariado = 'persona';

		if (voluntariadoPorEspecie.horas > 0) {
			voluntariado = voluntariadoPorEspecie.horas;
			unidadVoluntariado = 'horas';
		} else if (voluntariadoPorEspecie.dias > 0) {
			voluntariado = voluntariadoPorEspecie.dias;
			unidadVoluntariado = 'dias';
		} else if (voluntariadoPorEspecie.persona > 0) {
			voluntariado = voluntariadoPorEspecie.persona;
			unidadVoluntariado = 'persona';
		}

		return {
			voluntariado,
			unidadVoluntariado,
			monetaria,
			especie,
			totalProyectos: new Set(colaboracionesAprobadas.map((c) => c.proyecto_id)).size,
			distribucion: {
				voluntariado: proyectosPorTipo.voluntariado.size,
				monetaria: proyectosPorTipo.monetaria.size,
				especie: proyectosPorTipo.especie.size
			}
		};
	}

	private formatearEstado(estado: string): string {
		const mapeo: Record<string, string> = {
			en_curso: 'En curso',
			en_revision: 'En revisión',
			completado: 'Completado',
			cancelado: 'Cancelado',
			borrador: 'Borrador'
		};
		return mapeo[estado] || estado;
	}

	private getColorEstado(estado: string): string {
		const colores: Record<string, string> = {
			en_curso: '#3b82f6',
			en_revision: '#f59e0b',
			completado: '#10b981',
			cancelado: '#ef4444',
			borrador: '#6b7280'
		};
		return colores[estado] || '#6b7280';
	}

	private async calcularProyectosRecomendados(colaborador: any, proyectosColaborador: any[]) {
		// Obtener todos los proyectos disponibles
		const todosProyectos = await this.proyectoRepo.findAllSummary();

		// Filtrar proyectos en los que ya colabora
		const idsProyectosColaborando = new Set(
			proyectosColaborador.map((p) => p.id_proyecto?.toString())
		);

		const proyectosDisponibles = todosProyectos.filter(
			(p) =>
				p.id_proyecto &&
				!idsProyectosColaborando.has(p.id_proyecto.toString()) &&
				p.estado === 'en_curso'
		);

		// Verificar si el colaborador tiene preferencias definidas
		const tienePreferencias =
			(colaborador.categorias_preferidas && colaborador.categorias_preferidas.length > 0) ||
			(colaborador.tipos_participacion_preferidas &&
				colaborador.tipos_participacion_preferidas.length > 0);

		let proyectosFiltrados: any[] = [];

		if (tienePreferencias) {
			// Filtrar por preferencias
			const categoriasPreferidas = new Set(
				colaborador.categorias_preferidas?.map((c: any) => c.id_categoria) || []
			);
			const tiposPreferidos = new Set(
				colaborador.tipos_participacion_preferidas?.map((t: any) => t.id_tipo_participacion) || []
			);

			proyectosFiltrados = proyectosDisponibles
				.map((proyecto) => {
					let coincidencias = 0;
					let totalCriterios = 0;

					// Verificar coincidencia de categoría
					if (categoriasPreferidas.size > 0) {
						totalCriterios++;
						const categoriaProyecto = proyecto.categorias?.[0]?.id_categoria;
						if (categoriaProyecto && categoriasPreferidas.has(categoriaProyecto)) {
							coincidencias++;
						}
					}

					// Verificar coincidencia de tipos de participación
					if (tiposPreferidos.size > 0) {
						totalCriterios++;
						const tiposProyecto =
							proyecto.participacion_permitida?.map((pp: any) => pp.id_tipo_participacion) || [];
						if (tiposProyecto.some((t: number) => tiposPreferidos.has(t))) {
							coincidencias++;
						}
					}

					const porcentajeCoincidencia =
						totalCriterios > 0 ? Math.round((coincidencias / totalCriterios) * 100) : 0;

					return {
						proyecto,
						coincidencia: porcentajeCoincidencia
					};
				})
				.filter((item) => item.coincidencia > 0)
				.sort((a, b) => b.coincidencia - a.coincidencia)
				.slice(0, 2);
		} else {
			// Si no tiene preferencias, mostrar los 2 proyectos más recientes
			proyectosFiltrados = proyectosDisponibles
				.sort((a, b) => {
					const fechaA = a.created_at ? new Date(a.created_at).getTime() : 0;
					const fechaB = b.created_at ? new Date(b.created_at).getTime() : 0;
					return fechaB - fechaA;
				})
				.slice(0, 2)
				.map((proyecto) => ({
					proyecto,
					coincidencia: 0
				}));
		}

		// Mapear a formato esperado por el componente
		return proyectosFiltrados.map((item) => {
			// Formatear ubicación según modalidad
			let ubicacionTexto = 'Sin ubicación';
			if (item.proyecto.proyecto_ubicaciones && item.proyecto.proyecto_ubicaciones.length > 0) {
				const primeraUbicacion = item.proyecto.proyecto_ubicaciones[0].ubicacion;
				if (primeraUbicacion) {
					if (primeraUbicacion.modalidad === 'virtual') {
						ubicacionTexto = 'Virtual';
					} else if (primeraUbicacion.modalidad === 'presencial') {
						const localidad = primeraUbicacion.localidad?.nombre || '';
						const provincia = primeraUbicacion.localidad?.provincia?.nombre || '';
						ubicacionTexto = [localidad, provincia].filter(Boolean).join(', ') || 'Presencial';
					}
				}
			}

			return {
				id: item.proyecto.id_proyecto?.toString() || '',
				titulo: item.proyecto.titulo || 'Sin título',
				institucion: item.proyecto.institucion?.nombre_legal || 'Sin institución',
				categoria: item.proyecto.categorias?.[0]?.descripcion || 'Sin categoría',
				imagen: item.proyecto.url_portada || undefined,
				coincidencia: item.coincidencia,
				ubicacion: ubicacionTexto
			};
		});
	}
}
