import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';
import { prisma } from '$lib/infrastructure/prisma/client';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const usuarioSesion = locals.usuario;
		if (!usuarioSesion?.id_usuario) {
			return json(
				{
					success: false,
					error: 'Tenés que iniciar sesión para subir la documentación de verificación.'
				},
				{ status: 401 }
			);
		}
		if (usuarioSesion.rol !== 'institucion') {
			return json(
				{
					success: false,
					error: 'Solo las cuentas de institución pueden enviar esta documentación.'
				},
				{ status: 403 }
			);
		}

		const formData = await request.formData();
		const files = formData.getAll('files') as File[];

		if (!files.length) {
			return json({ success: false, error: 'Seleccioná al menos un archivo.' }, { status: 400 });
		}

		const usuarioIdInt = usuarioSesion.id_usuario;
		const archivosParaSubir: { name: string; type: string; size: number; path: string }[] = [];

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

				throw new Error(`Fallo al subir el archivo ${file.name} a Storage.`);
			}

			archivosParaSubir.push({
				name: file.name,
				type: file.type,
				size: file.size,
				path: filePath
			});
		}

		const resultado = await prisma.$transaction(async (tx) => {
			let verificacion = await tx.verificacion.findFirst({
				where: {
					usuario_id: usuarioIdInt,
					estado: 'pendiente'
				},
				include: { documentos: true }
			});

			const dataArchivos = archivosParaSubir.map((arch) => ({
				nombre_original: arch.name,
				url: arch.path,
				tipo_mime: arch.type,
				tamanio_bytes: arch.size,
				descripcion: 'Documentación de verificación',
				usuario: { connect: { id_usuario: usuarioIdInt } }
			}));

			if (!verificacion) {
				verificacion = await tx.verificacion.create({
					data: {
						tipo: 'institucional',
						estado: 'pendiente',
						usuario: { connect: { id_usuario: usuarioIdInt } },
						fecha_vencimiento: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
						documentos: {
							create: dataArchivos
						}
					},
					include: { documentos: true }
				});
			} else {
				verificacion = await tx.verificacion.update({
					where: { id_verificacion: verificacion.id_verificacion },
					data: {
						documentos: {
							create: dataArchivos
						}
					},
					include: { documentos: true }
				});
			}

			await tx.usuario.update({
				where: { id_usuario: usuarioIdInt },
				data: { estado_verificacion: 'pendiente' }
			});

			return verificacion;
		});

		return json({
			success: true,
			data: {
				verificacion: resultado,
				archivos: resultado.documentos
			},
			message: 'Documentación enviada exitosamente'
		});
	} catch (error) {
		console.error('Error en carga de verificación:', error);

		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Error interno al procesar archivos'
			},
			{ status: 500 }
		);
	}
};
