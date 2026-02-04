import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { ObtenerMisAportes } from '$lib/domain/use-cases/colaboraciones/ObtenerMisAportes';

export const load: PageServerLoad = async ({ params, locals }) => {
	const usuario = locals.usuario;

	if (!usuario || usuario.rol !== 'colaborador' || !usuario.id_usuario) {
		throw error(401, 'Debes iniciar sesión como colaborador para ver tus aportes');
	}

	const userId = usuario.id_usuario;
	const projectId = Number(params.id);

	const colaboracionRepo = new PostgresColaboracionRepository();
	const proyectoRepo = new PostgresProyectoRepository();
	const obtenerMisAportes = new ObtenerMisAportes(colaboracionRepo, proyectoRepo);

	try {
		const { colaboracion, aportes, proyecto } = await obtenerMisAportes.execute(userId, projectId);

		if (!colaboracion) {
			throw error(404, 'Colaboración no encontrada');
		}

		return JSON.parse(
			JSON.stringify({
				proyecto,
				colaboracion,
				aportes
			})
		);
	} catch (e) {
		console.error(e);
		throw error(404, 'Proyecto no encontrado o error cargando aportes');
	}
};
