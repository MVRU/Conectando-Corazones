import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresReporteRepository } from '$lib/infrastructure/supabase/postgres/reporte.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { ResolverReporte } from '$lib/domain/use-cases/reportes/ResolverReporte';

// PATCH /api/reportes/[id] — Verificar o desestimar un reporte (solo admin)
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const usuario = locals.usuario;
	if (!usuario || usuario.rol !== 'administrador') {
		return json({ error: 'Acceso denegado. Solo administradores.' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'ID de reporte inválido.' }, { status: 400 });
	}

	try {
		const data = await request.json();
		
		if (!data.estado || !['verificado', 'desestimado'].includes(data.estado)) {
			return json({ error: 'Estado inválido. Debe ser "verificado" o "desestimado".' }, { status: 400 });
		}

		const comentario = data.comentario?.trim();
		if (!comentario || comentario.length < 20) {
			return json({ error: 'El comentario debe tener al menos 20 caracteres.' }, { status: 400 });
		}
		if (comentario.length > 800) {
			return json({ error: 'El comentario no puede superar los 800 caracteres.' }, { status: 400 });
		}

		const repo = new PostgresReporteRepository();
		const proyRepo = new PostgresProyectoRepository();
		const resolverReporte = new ResolverReporte(repo, proyRepo);

		const reporte = await resolverReporte.execute({
			reporte_id: id,
			nuevo_estado: data.estado as 'verificado' | 'desestimado',
			admin_id: usuario.id_usuario!,
			comentario: data.comentario
		});

		return json({ success: true, reporte });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Error interno.';
		console.error(`[PATCH /api/reportes/${id}] Error:`, error);
		return json({ success: false, error: message }, { status: 400 });
	}
};
