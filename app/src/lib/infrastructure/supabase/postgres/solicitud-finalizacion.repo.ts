import {
	ejecutarEnTransaccionExistenteOTotal,
	type PrismaDbClient,
	prisma
} from '$lib/infrastructure/prisma/client';
import type { SolicitudFinalizacionRepository } from '$lib/domain/repositories/SolicitudFinalizacionRepository';
import type { SolicitudFinalizacion } from '$lib/domain/types/SolicitudFinalizacion';

const archivoInclude = { include: { usuario: true } } as const;

export class PostgresSolicitudFinalizacionRepository
	implements SolicitudFinalizacionRepository
{
	constructor(private readonly db: PrismaDbClient = prisma) {}

	async findByProyectoId(proyectoId: number): Promise<SolicitudFinalizacion | null> {
		const solicitud = await this.db.solicitudFinalizacion.findFirst({
			where: {
				proyecto_id: proyectoId
			},
			orderBy: {
				created_at: 'desc'
			},
			include: {
				proyecto: true,
				solicitud_evidencias: {
					include: {
						evidencia: {
							include: {
								archivos: archivoInclude,
								participacion_permitida: true
							}
						}
					}
				},
				evaluaciones: true
			}
		});

		if (!solicitud) return null;

		return this.toDomain(solicitud);
	}

	async findRechazadasByProyectoId(proyectoId: number): Promise<SolicitudFinalizacion[]> {
		const solicitudes = await this.db.solicitudFinalizacion.findMany({
			where: {
				proyecto_id: proyectoId,
				estado: 'rechazada'
			},
			orderBy: {
				created_at: 'desc'
			},
			select: {
				id_solicitud: true,
				proyecto_id: true,
				estado: true,
				created_at: true
			}
		});

		return solicitudes.map((s) => ({
			id_solicitud: s.id_solicitud,
			proyecto_id: s.proyecto_id,
			estado: s.estado ?? undefined,
			created_at: s.created_at ?? undefined,
			evidencia_ids: []
		}));
	}

	async updateEstado(
		id: number,
		estado: string,
		_motivoRechazo?: string
	): Promise<SolicitudFinalizacion> {
		const updated = await this.db.solicitudFinalizacion.update({
			where: { id_solicitud: id },
			data: {
				estado
			},
			include: {
				proyecto: true,
				solicitud_evidencias: {
					include: {
						evidencia: {
							include: {
								archivos: archivoInclude,
								participacion_permitida: true
							}
						}
					}
				},
				evaluaciones: true
			}
		});

		return this.toDomain(updated);
	}

	async countRechazadasByProyectoId(proyectoId: number): Promise<number> {
		const count = await this.db.solicitudFinalizacion.count({
			where: {
				proyecto_id: proyectoId,
				estado: 'rechazada'
			}
		});

		return count;
	}

	async create(solicitud: SolicitudFinalizacion): Promise<SolicitudFinalizacion> {
		if (!solicitud.proyecto_id) {
			throw new Error('La solicitud de finalización debe estar asociada a un proyecto.');
		}

		if (!solicitud.evidencia_ids || solicitud.evidencia_ids.length === 0) {
			throw new Error('La solicitud de finalización debe incluir al menos una evidencia.');
		}

		const created = await ejecutarEnTransaccionExistenteOTotal(this.db, async (tx) => {
			const nuevaSolicitud = await tx.solicitudFinalizacion.create({
				data: {
					proyecto_id: solicitud.proyecto_id,
					estado: solicitud.estado ?? 'pendiente'
				}
			});

			for (const evidenciaId of solicitud.evidencia_ids) {
				await tx.solicitudFinalizacionEvidencia.create({
					data: {
						evidencia_id: evidenciaId,
						solicitud_finalizacion_id: nuevaSolicitud.id_solicitud
					}
				});
			}

			const withRelations = await tx.solicitudFinalizacion.findUnique({
				where: { id_solicitud: nuevaSolicitud.id_solicitud },
				include: {
					proyecto: true,
					solicitud_evidencias: {
						include: {
							evidencia: {
								include: {
									archivos: archivoInclude,
									participacion_permitida: true
								}
							}
						}
					},
					evaluaciones: true
				}
			});

			if (!withRelations) {
				throw new Error('No se pudo recuperar la solicitud de finalización recién creada.');
			}

			return withRelations;
		});

		return this.toDomain(created);
	}

	private toDomain(record: any): SolicitudFinalizacion {
		const evidencias = record.solicitud_evidencias?.map((se: any) => ({
			id_evidencia: se.evidencia.id_evidencia,
			tipo_evidencia: se.evidencia.tipo_evidencia,
			created_at: se.evidencia.created_at,
			id_participacion_permitida: se.evidencia.id_participacion_permitida,
			archivos_ids: se.evidencia.archivos.map((a: any) => a.id_archivo),
			archivos: se.evidencia.archivos,
			participacion_permitida: se.evidencia.participacion_permitida
		}));

		const votos = record.evaluaciones
			?.filter((e: any) => e.voto === 'aprobado' && e.colaborador_id != null)
			.map((e: any) => e.colaborador_id as number);

		const domain: SolicitudFinalizacion = {
			id_solicitud: record.id_solicitud,
			estado: record.estado ?? undefined,
			created_at: record.created_at ?? undefined,
			proyecto_id: record.proyecto_id,
			evidencia_ids: evidencias?.map((e: any) => e.id_evidencia!) ?? [],
			votos,
			proyecto: record.proyecto,
			evidencias
		};

		return domain;
	}
}
