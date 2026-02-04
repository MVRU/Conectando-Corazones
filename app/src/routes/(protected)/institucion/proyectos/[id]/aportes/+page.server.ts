import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresEvidenciaRepository } from '$lib/infrastructure/supabase/postgres/evidencia.repo';
import { ObtenerAportesProyecto } from '$lib/domain/use-cases/institucion/ObtenerAportesProyecto';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);

	const colaboracionRepo = new PostgresColaboracionRepository();
	const proyectoRepo = new PostgresProyectoRepository();
	const usuarioRepo = new PostgresUsuarioRepository();
	const evidenciaRepo = new PostgresEvidenciaRepository();
	const obtenerAportesProyecto = new ObtenerAportesProyecto(
		colaboracionRepo,
		proyectoRepo,
		usuarioRepo,
		evidenciaRepo
	);

	try {
		const { proyecto, colaboradores, evidenciasInstitucion } =
			await obtenerAportesProyecto.execute(projectId);

		return {
			colaboradores: JSON.parse(JSON.stringify(colaboradores)),
			evidenciasInstitucion: JSON.parse(JSON.stringify(evidenciasInstitucion)),
			projectName: proyecto.titulo,
			proyecto: JSON.parse(JSON.stringify(proyecto))
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Proyecto no encontrado o error cargando colaboradores');
	}
};
