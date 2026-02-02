import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { ObtenerColaboracion } from '$lib/domain/use-cases/colaboraciones/ObtenerColaboracion';
import { ActualizarEstadoColaboracion } from '$lib/domain/use-cases/colaboraciones/ActualizarEstadoColaboracion';
import { AnularColaboracion } from '$lib/domain/use-cases/colaboraciones/AnularColaboracion';

const repo = new PostgresColaboracionRepository();

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = Number(params.id);
		if (isNaN(id)) {
			throw error(400, 'ID inválido');
		}

		const useCase = new ObtenerColaboracion(repo);
		const colaboracion = await useCase.execute(id);

		if (!colaboracion) {
			throw error(404, 'Colaboración no encontrada');
		}

		return json(colaboracion);
	} catch (err) {
		console.error('Error in GET /api/colaboraciones/[id]:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, 'Error al obtener colaboración');
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const id = Number(params.id);
		if (isNaN(id)) {
			throw error(400, 'ID inválido');
		}

		const data = await request.json();

		if (!data.estado || !['aprobada', 'rechazada'].includes(data.estado)) {
			throw error(400, 'Estado inválido. Debe ser "aprobada" o "rechazada"');
		}

		if (data.estado === 'rechazada' && !data.justificacion) {
			throw error(400, 'Se requiere justificación para rechazar');
		}

		const useCase = new ActualizarEstadoColaboracion(repo);
		const colaboracion = await useCase.execute(id, data.estado, data.justificacion);

		return json(colaboracion);
	} catch (err) {
		console.error('Error in PATCH /api/colaboraciones/[id]:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, 'Error al actualizar colaboración');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = Number(params.id);
		if (isNaN(id)) {
			throw error(400, 'ID inválido');
		}

		const useCase = new AnularColaboracion(repo);
		await useCase.execute(id);

		return json({ success: true });
	} catch (err) {
		console.error('Error in DELETE /api/colaboraciones/[id]:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, 'Error al anular colaboración');
	}
};
