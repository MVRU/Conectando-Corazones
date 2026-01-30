import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { ObtenerProyectosPerfil } from '$lib/domain/use-cases/perfil/ObtenerProyectosPerfil';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const username = params.username;

		if (!username) {
			throw error(404, 'Usuario no encontrado');
		}

		const usuarioRepo = new PostgresUsuarioRepository();
		const proyectoRepo = new PostgresProyectoRepository();

		// 1. Obtener Usuario
		const perfilUsuario = await usuarioRepo.findByUsername(username);
		if (!perfilUsuario) {
			throw error(404, 'Usuario no encontrado');
		}

		// 2. Obtener Proyectos
		const obtenerProyectos = new ObtenerProyectosPerfil(proyectoRepo);
		const proyectos = await obtenerProyectos.execute(perfilUsuario.id_usuario, perfilUsuario.rol);

		// 3. Obtener Reseñas (Backend no implementado aún)
		const resenas: any[] = [];

		// 4. Verificar si es mi perfil
		const esMiPerfil = locals.usuario?.id_usuario === perfilUsuario.id_usuario;

		// Serializar todas las entidades de dominio
		return {
			perfilUsuario: JSON.parse(JSON.stringify(perfilUsuario)),
			proyectos: JSON.parse(JSON.stringify(proyectos)),
			resenas: JSON.parse(JSON.stringify(resenas)),
			esMiPerfil
		};
	} catch (err) {
		console.error('Error loading profile:', err);

		// Si es un error 404, lo re-lanzamos
		if (err && typeof err === 'object' && 'status' in err && (err as any).status === 404) {
			throw err;
		}

		// Para otros errores, lanzamos un 500
		throw error(500, 'Error al cargar el perfil');
	}
};
