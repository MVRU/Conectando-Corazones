import { json, type RequestHandler } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';
import { randomUUID } from 'crypto';

export const POST: RequestHandler = async ({ request, locals }) => {
	// 1. Seguridad: Usuario debe estar autenticado
	if (!locals.user || !locals.usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const { nombre_archivo, tipo_mime, bucket } = await request.json();

		if (!nombre_archivo || !tipo_mime) {
			return json({ error: 'Faltan campos requeridos' }, { status: 400 });
		}

		// Validar bucket (permitir solo buckets definidos)
		const targetBucket = bucket === 'avatars' ? 'avatars' : 'evidencias';

		// Generar ruta segura con UUID
		const fileExt = nombre_archivo.split('.').pop();
		const uniqueName = `${randomUUID()}.${fileExt}`;
		const filePath = `${locals.user.id}/${uniqueName}`;

		// Generar URL de subida firmada (válida durante 60 segundos)
		const { data, error } = await supabaseAdmin.storage
			.from(targetBucket)
			.createSignedUploadUrl(filePath);

		if (error) {
			throw new Error('Error al generar URL de subida: ' + error.message);
		}

		return json({
			uploadUrl: data.signedUrl,
			path: data.path,
			token: data.token,
			fullPath: `${targetBucket}/${data.path}` // Esto es lo que guardamos en DB
		});
	} catch (error: any) {
		return json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
	}
};
