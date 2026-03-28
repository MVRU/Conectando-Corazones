import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresArchivoRepository } from '$lib/infrastructure/supabase/postgres/archivo.repo';
import { ActualizarFotoPerfil } from '$lib/domain/use-cases/usuarios/ActualizarFotoPerfil';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const user = locals.usuario;
	if (!user || !user.id_usuario) {
		return json({ error: 'No autenticado o usuario no encontrado' }, { status: 401 });
	}

	try {
		const usuarioRepo = new PostgresUsuarioRepository();
		const archivoRepo = new PostgresArchivoRepository();

		let url: string;
		let nombreArchivo: string;
		let tipoMime: string;
		let tamanio: number;

		const contentType = request.headers.get('content-type') ?? '';

		if (contentType.includes('multipart/form-data')) {
			const formData = await request.formData();
			const archivo = formData.get('archivo');

			if (!archivo || !(archivo instanceof File)) {
				return json({ error: 'Archivo requerido' }, { status: 400 });
			}

			// Validaciones de negocio
			if (!ALLOWED_MIME_TYPES.includes(archivo.type)) {
				return json(
					{
						error: `Tipo de archivo no permitido. Solo se aceptan: ${ALLOWED_MIME_TYPES.join(', ')}`
					},
					{ status: 400 }
				);
			}

			if (archivo.size > MAX_FILE_SIZE) {
				return json(
					{
						error: `El archivo es demasiado pesado (máximo ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB)`
					},
					{ status: 400 }
				);
			}

			// Cleanup de foto anterior
			const usuarioActual = await usuarioRepo.findById(user.id_usuario);

			if (usuarioActual?.url_foto) {
				try {
					const urlPartes = usuarioActual.url_foto.split('/avatares/');
					if (urlPartes.length > 1) {
						const oldPath = urlPartes[urlPartes.length - 1];
						await supabaseAdmin.storage.from('avatares').remove([oldPath]);
					}
				} catch (cleanupError) {
					console.error('Error al limpiar foto anterior:', cleanupError);
				}
			}

			const ext = archivo.name.split('.').pop() ?? 'jpg';
			const storagePath = `avatares/${user.id_usuario}/${Date.now()}.${ext}`;
			const bytes = await archivo.arrayBuffer();

			const { error: uploadError } = await supabaseAdmin.storage
				.from('avatares')
				.upload(storagePath, bytes, { contentType: archivo.type, upsert: true });

			if (uploadError) {
				throw new Error(`Error al subir imagen: ${uploadError.message}`);
			}

			url = supabaseAdmin.storage.from('avatares').getPublicUrl(storagePath).data.publicUrl;
			nombreArchivo = archivo.name;
			tipoMime = archivo.type;
			tamanio = archivo.size;
		} else {
			const body = await request.json();
			url = body.url;
			nombreArchivo = body.nombreArchivo || url.split('/').pop() || 'foto-perfil';
			tipoMime = body.tipoMime || 'image/jpeg';
			tamanio = body.tamanio || 0;

			if (!url) {
				return json({ error: 'Faltan datos requeridos (url)' }, { status: 400 });
			}
		}

		const useCase = new ActualizarFotoPerfil(usuarioRepo, archivoRepo);

		const usuarioActualizado = await useCase.execute({
			usuarioId: user.id_usuario,
			url,
			nombreArchivo,
			tipoMime: tipoMime || 'application/octet-stream',
			tamanio: tamanio || 0
		});

		// Actualizar cookie de sesión para que el Header y otros componentes reflejen el cambio
		const rememberMe = cookies.get('remember_me') === 'true';
		const maxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _pwd, ...usuarioActualizadoSafe } = usuarioActualizado.toPOJO();

		cookies.set('session_usuario', JSON.stringify(usuarioActualizadoSafe), {
			path: '/',
			httpOnly: false,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge
		});

		return json({ success: true, url, usuario: usuarioActualizadoSafe });
	} catch (error) {
		console.error('Error actualizando foto de perfil:', error);
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 500 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
