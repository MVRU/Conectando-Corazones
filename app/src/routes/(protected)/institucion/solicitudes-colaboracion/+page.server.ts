import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	if (usuario.rol !== 'institucion') {
		throw error(403, 'Acceso denegado. Esta página es para instituciones.');
	}

	const proyectoRepo = new PostgresProyectoRepository();
	const proyectos = await proyectoRepo.findByInstitucionId(usuario.id_usuario!);

	// Filtra solo los proyectos en curso
	const proyectosEnCurso = proyectos.filter(p => p.estado?.toLowerCase() === 'en_curso');

	return JSON.parse(
		JSON.stringify({
			proyectos: proyectosEnCurso
		})
	);
};
