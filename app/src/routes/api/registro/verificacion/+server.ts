import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';
import { prisma } from '$lib/infrastructure/prisma/client';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const id_usuario = formData.get('id_usuario');
		const files = formData.getAll('files') as File[];

		if (!id_usuario || !files.length) {
			return json(
				{ success: false, error: 'Faltan datos requeridos (usuario o archivos)' },
				{ status: 400 }
			);
		}

		const usuarioIdInt = parseInt(id_usuario.toString());

		// 1. Buscar si ya existe una verificación pendiente o crearla
		let verificacion = await prisma.verificacion.findFirst({
			where: {
				usuario_id: usuarioIdInt,
				estado: 'pendiente'
			}
		});

		if (!verificacion) {
			verificacion = await prisma.verificacion.create({
				data: {
					tipo: 'institucional', // Asumimos institucional dado el contexto, o podríamos recibirlo del body
					estado: 'pendiente',
					usuario_id: usuarioIdInt,
					created_at: new Date(),
					fecha_vencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
				}
			});
		}

		const archivosCreados = [];

		// 2. Subir archivos a Storage y crear registros en DB
		for (const file of files) {
			const fileExt = file.name.split('.').pop();
			const fileName = `${usuarioIdInt}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
			const filePath = `verificaciones/${fileName}`;

			const { error: uploadError } = await supabaseAdmin.storage
				.from('documentos-privados')
				.upload(filePath, file, {
					contentType: file.type,
					upsert: false
				});

			if (uploadError) {
				console.error(`Error subiendo archivo ${file.name}:`, uploadError);
				continue;
			}

			const publicUrl = supabaseAdmin.storage.from('documentos-privados').getPublicUrl(filePath)
				.data.publicUrl;

			const archivo = await prisma.archivo.create({
				data: {
					nombre_original: file.name,
					url: filePath, // Guardamos el path del storage
					tipo_mime: file.type,
					tamanio_bytes: file.size,
					descripcion: 'Documentación de Verificación',
					usuario_id: usuarioIdInt,
					verificacion_id: verificacion.id_verificacion
				}
			});

			archivosCreados.push(archivo);
		}

		// Actualizar estado de verificación del usuario
		await prisma.usuario.update({
			where: { id_usuario: usuarioIdInt },
			data: { estado_verificacion: 'pendiente' }
		});

		return json({
			success: true,
			data: {
				verificacion,
				archivos: archivosCreados
			},
			message: 'Documentación enviada exitosamente'
		});
	} catch (error: any) {
		console.error('Error en carga de verificación:', error);
		return json(
			{
				success: false,
				error: error.message || 'Error interno al procesar archivos'
			},
			{ status: 500 }
		);
	}
};
