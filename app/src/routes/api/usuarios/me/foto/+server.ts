import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresArchivoRepository } from '$lib/infrastructure/supabase/postgres/archivo.repo';
import { ActualizarFotoPerfil } from '$lib/domain/use-cases/usuarios/ActualizarFotoPerfil';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.usuario;
	if (!user || !user.id_usuario) {
		return json({ error: 'No autenticado o usuario no encontrado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { url, nombreArchivo, tipoMime, tamanio } = body;

		if (!url || !nombreArchivo) {
			return json({ error: 'Faltan datos requeridos' }, { status: 400 });
		}

		const usuarioRepo = new PostgresUsuarioRepository();
		const archivoRepo = new PostgresArchivoRepository();
		const useCase = new ActualizarFotoPerfil(usuarioRepo, archivoRepo);

		await useCase.execute({
			usuarioId: user.id_usuario,
			url,
			nombreArchivo,
			tipoMime: tipoMime || 'application/octet-stream',
			tamanio: tamanio || 0
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error actualizando foto de perfil:', error);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
