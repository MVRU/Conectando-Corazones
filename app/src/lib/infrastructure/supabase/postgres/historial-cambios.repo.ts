import { prisma } from '$lib/infrastructure/prisma/client';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import type { HistorialDeCambios } from '$lib/domain/types/HistorialDeCambios';

export class PostgresHistorialDeCambiosRepository implements HistorialDeCambiosRepository {
	async create(cambio: HistorialDeCambios, tx?: any): Promise<HistorialDeCambios> {
		const db = tx || prisma;

		const created = await db.historialDeCambios.create({
			data: {
				tipo_objeto: cambio.tipo_objeto,
				id_objeto: cambio.id_objeto,
				accion: cambio.accion,
				atributo_afectado: cambio.atributo_afectado,
				valor_anterior: cambio.valor_anterior,
				valor_nuevo: cambio.valor_nuevo,
				justificacion: cambio.justificacion,
				usuario_id: cambio.usuario_id
			}
		});

		return {
			id_cambio: created.id_cambio,
			tipo_objeto: created.tipo_objeto,
			id_objeto: created.id_objeto,
			accion: created.accion,
			atributo_afectado: created.atributo_afectado,
			valor_anterior: created.valor_anterior,
			valor_nuevo: created.valor_nuevo,
			justificacion: created.justificacion || undefined,
			created_at: created.created_at || undefined,
			usuario_id: created.usuario_id || undefined
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
			id_cambio: c.id_cambio,
			tipo_objeto: c.tipo_objeto,
			id_objeto: c.id_objeto,
			accion: c.accion,
			atributo_afectado: c.atributo_afectado,
			valor_anterior: c.valor_anterior,
			valor_nuevo: c.valor_nuevo,
			justificacion: c.justificacion || undefined,
			created_at: c.created_at || undefined,
			usuario_id: c.usuario_id || undefined
		}));
	}
}
