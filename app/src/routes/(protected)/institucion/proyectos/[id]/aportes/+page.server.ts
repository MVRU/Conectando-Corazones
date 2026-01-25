import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { MockColaboracionRepository } from '$lib/infrastructure/repositories/mock/MockColaboracionRepository';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';
import { MockUsuarioRepository } from '$lib/infrastructure/repositories/mock/MockUsuarioRepository';
import { ObtenerAportesProyecto } from '$lib/domain/use-cases/institucion/ObtenerAportesProyecto';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);

	const colaboracionRepo = new MockColaboracionRepository();
	const proyectoRepo = new MockProyectoRepository();
	const usuarioRepo = new MockUsuarioRepository();
	const obtenerAportesProyecto = new ObtenerAportesProyecto(
		colaboracionRepo,
		proyectoRepo,
		usuarioRepo
	);

	try {
		const { proyecto, colaboradores } = await obtenerAportesProyecto.execute(projectId);

		return {
			colaboradores,
			projectName: proyecto.titulo,
			proyecto
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Proyecto no encontrado o error cargando colaboradores');
	}
};
