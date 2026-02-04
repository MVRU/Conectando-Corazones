import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import type { HistorialDeCambios } from '$lib/domain/types/HistorialDeCambios';
import { prisma } from '$lib/infrastructure/prisma/client';

export class PostgresHistorialDeCambiosRepository implements HistorialDeCambiosRepository {
	async create(cambio: HistorialDeCambios, tx?: any): Promise<HistorialDeCambios> {
		const client = tx || prisma;

		const created = await client.historialDeCambios.create({
			data: {
				tipo_objeto: cambio.tipo_objeto,
				id_objeto: cambio.id_objeto,
				accion: cambio.accion,
				atributo_afectado: cambio.atributo_afectado,
				valor_anterior: cambio.valor_anterior,
				valor_nuevo: cambio.valor_nuevo,
				justificacion: cambio.justificacion,
				usuario_id: cambio.usuario_id,
				created_at: new Date()
			}
		});

		return {
			...created,
			justificacion: created.justificacion ?? undefined,
			usuario_id: created.usuario_id || null,
			created_at: created.created_at || new Date()
		};
	}

	async findByObjeto(tipoObjeto: string, idObjeto: number): Promise<HistorialDeCambios[]> {
		const cambios = await prisma.historialDeCambios.findMany({
			where: {
				tipo_objeto: tipoObjeto,
				id_objeto: idObjeto
			},
			orderBy: {
				created_at: 'desc'
			}
		});

		return cambios.map((c) => ({
			...c,
			justificacion: c.justificacion ?? undefined,
			usuario_id: c.usuario_id || null,
			created_at: c.created_at || new Date()
		}));
	}
}
