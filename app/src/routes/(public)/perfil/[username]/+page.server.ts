import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { ObtenerUsuario } from '$lib/domain/use-cases/usuarios/ObtenerUsuario';
import { ObtenerProyectosPerfil } from '$lib/domain/use-cases/perfil/ObtenerProyectosPerfil';
import { PostgresCategoriaRepository } from '$lib/infrastructure/supabase/postgres/categoria.repo';
import { GetAllCategorias } from '$lib/domain/use-cases/maestros/GetAllCategorias';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	try {
		const username = params.username;

		if (!username) {
			throw error(404, 'Usuario no encontrado');
		}

		const usuarioRepo = new PostgresUsuarioRepository();
		const obtenerUsuario = new ObtenerUsuario(usuarioRepo);
		const proyectoRepo = new PostgresProyectoRepository();
		const categoriaRepo = new PostgresCategoriaRepository();

		// 1. Obtener Usuario
		const perfilUsuario = await obtenerUsuario.porUsername(username);
		if (!perfilUsuario) {
			throw error(404, 'Usuario no encontrado');
		}

		// 2. Obtener Proyectos
		const obtenerProyectos = new ObtenerProyectosPerfil(proyectoRepo);
		const getAllCategorias = new GetAllCategorias(categoriaRepo);

		const [proyectos, categorias] = await Promise.all([
			obtenerProyectos.execute(perfilUsuario.id_usuario, perfilUsuario.rol),
			getAllCategorias.execute()
		]);

		// 3. Obtener Reseñas (Backend no implementado aún)
		const resenas: any[] = [];

		// 4. Verificar si es mi perfil
		const esMiPerfil = locals.usuario?.id_usuario === perfilUsuario.id_usuario;

		// Serializar todas las entidades de dominio
		return {
			perfilUsuario: JSON.parse(JSON.stringify(perfilUsuario)),
			proyectos: JSON.parse(JSON.stringify(proyectos)),
			resenas: JSON.parse(JSON.stringify(resenas)),
			categorias: categorias.map((c) => ({ ...c })),
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
