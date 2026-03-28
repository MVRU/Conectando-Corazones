import { prisma } from '$lib/infrastructure/prisma/client';
import { Prisma } from '@prisma/client';
import type { HistorialDeCambiosRepository, FiltrosHistorial } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import type { HistorialDeCambios } from '$lib/domain/types/HistorialDeCambios';

export class PostgresHistorialDeCambiosRepository implements HistorialDeCambiosRepository {
	private mapear(c: {
		id_cambio: number;
		tipo_objeto: string;
		id_objeto: number;
		accion: string;
		atributo_afectado: string;
		valor_anterior: string;
		valor_nuevo: string;
		justificacion: string | null;
		created_at: Date | null;
		usuario_id: number | null;
	}): HistorialDeCambios {
		return {
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
		};
	}

	async create(cambio: HistorialDeCambios, tx?: unknown): Promise<HistorialDeCambios> {
		const db = (tx as Prisma.TransactionClient) || prisma;

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

		return this.mapear(created);
	}

	async findByObjeto(tipoObjeto: string, idObjeto: number): Promise<HistorialDeCambios[]> {
		const cambios = await prisma.historialDeCambios.findMany({
			where: { tipo_objeto: tipoObjeto, id_objeto: idObjeto },
			orderBy: { created_at: 'desc' }
		});

		return cambios.map(this.mapear.bind(this));
	}

	async findAll(filtros?: FiltrosHistorial): Promise<HistorialDeCambios[]> {
		const where: Prisma.HistorialDeCambiosWhereInput = {};

		if (filtros?.tipo_objeto) where.tipo_objeto = filtros.tipo_objeto;
		if (filtros?.id_objeto) where.id_objeto = filtros.id_objeto;
		if (filtros?.accion) where.accion = filtros.accion;
		if (filtros?.usuario_id) where.usuario_id = filtros.usuario_id;
		if (filtros?.desde || filtros?.hasta) {
			where.created_at = {
				...(filtros.desde && { gte: filtros.desde }),
				...(filtros.hasta && { lte: filtros.hasta })
			};
		}

		const cambios = await prisma.historialDeCambios.findMany({
			where,
			orderBy: { created_at: 'desc' },
			take: filtros?.limit,
			skip: filtros?.offset
		});

		return cambios.map(this.mapear.bind(this));
	}

	async findByUsuario(usuarioId: number): Promise<HistorialDeCambios[]> {
		const cambios = await prisma.historialDeCambios.findMany({
			where: { usuario_id: usuarioId },
			orderBy: { created_at: 'desc' }
		});

		return cambios.map(this.mapear.bind(this));
	}

	async findByAccion(accion: string): Promise<HistorialDeCambios[]> {
		const cambios = await prisma.historialDeCambios.findMany({
			where: { accion },
			orderBy: { created_at: 'desc' }
		});

		return cambios.map(this.mapear.bind(this));
	}
}
