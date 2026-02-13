import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ObtenerDashboardColaborador } from '$lib/domain/use-cases/colaboraciones/ObtenerDashboardColaborador';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;

	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	if (usuario.rol !== 'colaborador') {
		throw redirect(303, '/');
	}

	try {
		const colaboracionRepo = new PostgresColaboracionRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const usuarioRepo = new PostgresUsuarioRepository();

		const obtenerDashboard = new ObtenerDashboardColaborador(
			colaboracionRepo,
			proyectoRepo,
			usuarioRepo
		);

		const dashboardData = await obtenerDashboard.execute(usuario.id_usuario!);

		return {
			dashboardData
		};
	} catch (error) {
		console.error('Error al cargar el dashboard del colaborador:', error);
		return {
			dashboardData: null,
			error: 'Error al cargar los datos del dashboard'
		};
	}
};
