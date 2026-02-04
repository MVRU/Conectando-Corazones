import { prisma } from '$lib/infrastructure/prisma/client';
import type { EvidenciaRepository } from '../../../domain/repositories/EvidenciaRepository';
import { Evidencia } from '../../../domain/entities/Evidencia';
import { Archivo } from '../../../domain/entities/Archivo';

export class PostgresEvidenciaRepository implements EvidenciaRepository {
	async findAllByProyecto(proyectoId: number): Promise<Evidencia[]> {
		const evidencias = await prisma.evidencia.findMany({
			where: {
				participacion_permitida: {
					id_proyecto: proyectoId
				}
			},
			include: {
				archivos: true
			}
		});

		return evidencias.map(
			(e) =>
				new Evidencia({
					id_evidencia: e.id_evidencia,
					tipo_evidencia: e.tipo_evidencia,
					created_at: e.created_at,
					id_participacion_permitida: e.id_participacion_permitida,
					archivos: e.archivos.map(
						(a: any) =>
							new Archivo({
								id_archivo: a.id_archivo,
								nombre_original: a.nombre_original,
								url: a.url,
								descripcion: a.descripcion,
								tipo_mime: a.tipo_mime,
								tamanio_bytes: a.tamanio_bytes,
								created_at: a.created_at,
								usuario_id: a.usuario_id,
								evidencia_id: a.evidencia_id,
								proyecto_id: a.proyecto_id
							})
					)
				})
		);
	}
}
