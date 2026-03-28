import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresArchivoRepository } from '$lib/infrastructure/supabase/postgres/archivo.repo';
import { ActualizarFotoPerfil } from '$lib/domain/use-cases/usuarios/ActualizarFotoPerfil';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.usuario;
	if (!user || !user.id_usuario) {
		return json({ error: 'No autenticado o usuario no encontrado' }, { status: 401 });
	}

	try {
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

			// TODO (Marina Milo): Validar tipo de archivo (solo imágenes) y tamaño máximo
			// TODO (Marina Milo): Implementar cleanup de la foto anterior en Storage antes de subir la nueva

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
			({ url, nombreArchivo, tipoMime, tamanio } = body);

			if (!url || !nombreArchivo) {
				return json({ error: 'Faltan datos requeridos' }, { status: 400 });
			}
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

		return json({ success: true, url });
	} catch (error) {
		console.error('Error actualizando foto de perfil:', error);
		if (error instanceof Error) {
			return json({ error: error.message }, { status: 500 });
		}
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};
