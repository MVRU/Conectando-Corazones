import type { LayoutServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

const OMITIR_RESUMEN_PROYECTOS_EN = /^\/colaborador\/proyectos\/[^/]+\/evaluar-cierre\/?$/;

export const load: LayoutServerLoad = async ({ locals, url }) => {
	try {
		if (OMITIR_RESUMEN_PROYECTOS_EN.test(url.pathname)) {
			return {
				proyectos: [],
				session: locals.session,
				usuario: locals.usuario ? locals.usuario.toPOJO() : null
			};
		}

		const repo = new PostgresProyectoRepository();
		// Usar findAllSummary() en lugar de findAll() para reducir datos cargados
		const proyectos = await repo.findAllSummary();

		return {
			proyectos: JSON.parse(JSON.stringify(proyectos)),
			session: locals.session,
			usuario: locals.usuario ? locals.usuario.toPOJO() : null
		};
	} catch (error) {
		console.error('Error en LayoutServerLoad:', error);
		return {
			proyectos: [],
			session: locals.session,
			usuario: locals.usuario ? locals.usuario.toPOJO() : null,
			error: 'No se pudieron cargar algunos datos globales.'
		};
	}
};
