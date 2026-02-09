import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ObtenerDashboardInstitucion } from '$lib/domain/use-cases/institucion/ObtenerDashboardInstitucion';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;

	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	if (usuario.rol !== 'institucion') {
		throw redirect(303, '/mi-panel');
	}

	try {
		const proyectoRepo = new PostgresProyectoRepository();
		const colaboracionRepo = new PostgresColaboracionRepository();
		const usuarioRepo = new PostgresUsuarioRepository();

		const useCase = new ObtenerDashboardInstitucion(proyectoRepo, colaboracionRepo, usuarioRepo);

		const dashboardData = await useCase.execute(usuario.id_usuario!);

		return {
			usuario: { ...usuario },
			dashboardData
		};
	} catch (error) {
		console.error('Error al cargar dashboard institucional:', error);
		return {
			usuario: { ...usuario },
			dashboardData: null,
			error: 'Error al cargar los datos del dashboard'
		};
	}
};
