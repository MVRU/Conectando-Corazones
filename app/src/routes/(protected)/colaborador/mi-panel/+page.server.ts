import type { PageServerLoad } from './$types';
import { ObtenerDashboardColaborador } from '$lib/domain/use-cases/colaboraciones/ObtenerDashboardColaborador';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresResenaRepository } from '$lib/infrastructure/supabase/postgres/resena.repo';
import { PostgresHistorialDeCambiosRepository } from '$lib/infrastructure/supabase/postgres/historial-cambios.repo';
import { PostgresChatRepository } from '$lib/infrastructure/supabase/postgres/chat.repo';
import { normalizarPeriodo, obtenerDesdePeriodo } from '$lib/utils/periodo';

/**
 * Carga de datos para el dashboard del colaborador.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 */
export const load: PageServerLoad = async ({ locals, url }) => {
	const usuario = locals.usuario!; // Garantizado por AuthGuard en hooks

	const periodo = normalizarPeriodo(url.searchParams.get('periodo'));
	const desde = obtenerDesdePeriodo(periodo);

	try {
		const colaboracionRepo = new PostgresColaboracionRepository();
		const proyectoRepo = new PostgresProyectoRepository();
		const usuarioRepo = new PostgresUsuarioRepository();
		const resenaRepo = new PostgresResenaRepository();
		const historialRepo = new PostgresHistorialDeCambiosRepository();
		const chatRepo = new PostgresChatRepository();

		const obtenerDashboard = new ObtenerDashboardColaborador(
			colaboracionRepo,
			proyectoRepo,
			usuarioRepo,
			resenaRepo,
			historialRepo,
			chatRepo
		);

		const dashboardData = await obtenerDashboard.execute(usuario.id_usuario!, { desde });

		return {
			dashboardData,
			periodo
		};
	} catch (error) {
		console.error('Error al cargar el dashboard del colaborador:', error);
		return {
			dashboardData: null,
			periodo,
			error: 'Error al cargar los datos del dashboard'
		};
	}
};
