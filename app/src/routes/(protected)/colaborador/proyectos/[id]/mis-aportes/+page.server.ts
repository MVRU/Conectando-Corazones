import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { MockColaboracionRepository } from '$lib/infrastructure/repositories/mock/MockColaboracionRepository';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';
import { ObtenerMisAportes } from '$lib/domain/use-cases/colaboraciones/ObtenerMisAportes';

export const load: PageServerLoad = async ({ params, locals }) => {
	const usuario = locals.usuario;

	if (!usuario || usuario.rol !== 'colaborador' || !usuario.id_usuario) {
		throw error(401, 'Debes iniciar sesión como colaborador para ver tus aportes');
	}

	const userId = usuario.id_usuario;
	const projectId = Number(params.id);

	const colaboracionRepo = new MockColaboracionRepository();
	const proyectoRepo = new MockProyectoRepository();
	const obtenerMisAportes = new ObtenerMisAportes(colaboracionRepo, proyectoRepo);

	try {
		const { colaboracion, aportes, proyecto } = await obtenerMisAportes.execute(userId, projectId);

		if (!colaboracion) {
			throw error(404, 'Colaboración no encontrada');
		}

		return {
			proyecto,
			colaboracion,
			aportes
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Proyecto no encontrado o error cargando aportes');
	}
};
