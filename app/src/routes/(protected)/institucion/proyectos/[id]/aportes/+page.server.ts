import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { ObtenerAportesProyecto } from '$lib/domain/use-cases/institucion/ObtenerAportesProyecto';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);

	const colaboracionRepo = new PostgresColaboracionRepository();
	const proyectoRepo = new PostgresProyectoRepository();
	const usuarioRepo = new PostgresUsuarioRepository();
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
