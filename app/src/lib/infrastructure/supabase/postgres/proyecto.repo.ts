import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { Proyecto } from '$lib/domain/entities/Proyecto';
import type { EstadoDescripcion } from '$lib/domain/types/Estado';
import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ProyectoMapper } from './mappers/proyecto.mapper';

export class PostgresProyectoRepository implements ProyectoRepository {
	private includeOptions = {
		estado: true,
		proyecto_categorias: {
			include: { categoria: true }
		},
		participacion_permitida: {
			include: { tipo_participacion: true }
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
						localidad: { include: { provincia: true } }
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
					console.error(`Error mapping project ${p.id_proyecto}:`, err);
					return null;
				}
			})
			.filter((p): p is Proyecto => p !== null);
	}

	/**
	 * Versión optimizada para listados - solo carga datos esenciales
	 * Reduce significativamente el tiempo de carga al evitar relaciones profundas
	 */
	async findAllSummary(): Promise<Proyecto[]> {
		const proyectos = await prisma.proyecto.findMany({
			select: {
				id_proyecto: true,
				titulo: true,
				resumen: true,
				url_portada: true,
				beneficiarios: true,
				created_at: true,
				fecha_fin_tentativa: true,
				institucion_id: true,
				estado: {
					select: {
						id_estado: true,
						descripcion: true
					}
				},
				institucion: {
					select: {
						id_usuario: true,
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
				}
			}
		});

		return proyectos
			.map((p) => {
				try {
					return ProyectoMapper.toDomain(p as any);
				} catch (err) {
					console.error(`Error mapping project ${p.id_proyecto}:`, err);
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
		return proyecto ? ProyectoMapper.toDomain(proyecto as any) : null;
	}

	async create(proyecto: Proyecto): Promise<Proyecto> {
		const result = await prisma.$transaction(
			async (tx) => {
				// 1. Obtener el ID del estado inicial 'en_curso'
				const estadoActivo = await tx.estado.findUnique({
					where: { descripcion: 'en_curso' }
				});

				if (!estadoActivo) throw new Error('Estado "en_curso" no encontrado en la base de datos');

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
						estado_id: estadoActivo.id_estado,
						beneficiarios: proyecto.beneficiarios ? Number(proyecto.beneficiarios) : null,
						fecha_fin_tentativa: proyecto.fecha_fin_tentativa
							? new Date(proyecto.fecha_fin_tentativa)
							: null
					}
				});

				// 3. Crear relaciones con categorías
				if (proyecto.categorias && proyecto.categorias.length > 0) {
					await tx.proyectoCategoria.createMany({
						data: proyecto.categorias.map((c) => ({
							proyecto_id: created.id_proyecto,
							categoria_id: c.id_categoria!
						}))
					});
				}

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
									actual: 0,
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

	// Método incompleto de ejemplo, la actualización de grafos es compleja // TODO: completar método
	async update(proyecto: Proyecto): Promise<Proyecto> {
		const updated = await prisma.proyecto.update({
			where: { id_proyecto: proyecto.id_proyecto },
			data: {
				titulo: proyecto.titulo,
				descripcion: proyecto.descripcion
				// ... otros compos
			},
			include: this.includeOptions
		});
		return ProyectoMapper.toDomain(updated as any);
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
}
