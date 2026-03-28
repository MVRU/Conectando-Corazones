import type { PageServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

/**
 * Carga de proyectos institucionales para gestión de solicitudes.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario!; // Garantizado por AuthGuard en hooks

	const proyectoRepo = new PostgresProyectoRepository();
	const proyectos = await proyectoRepo.findByInstitucionId(usuario.id_usuario!);

	// Filtra solo los proyectos en curso
	const proyectosEnCurso = proyectos.filter((p) => p.estado?.toLowerCase() === 'en_curso');

	return JSON.parse(
		JSON.stringify({
			proyectos: proyectosEnCurso
		})
	);
};
