import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';
import { prisma } from '$lib/infrastructure/prisma/client';

function validarInstitucionSesion(localsUsuario: App.Locals['usuario']) {
	if (!localsUsuario?.id_usuario) {
		return {
			ok: false as const,
			response: json(
				{
					success: false,
					error: 'Tenés que iniciar sesión para gestionar la documentación de verificación.'
				},
				{ status: 401 }
			)
		};
	}

	if (localsUsuario.rol !== 'institucion') {
		return {
			ok: false as const,
			response: json(
				{
					success: false,
					error: 'Solo las cuentas de institución pueden gestionar esta documentación.'
				},
				{ status: 403 }
			)
		};
	}

	return { ok: true as const };
}

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const sesion = validarInstitucionSesion(locals.usuario);
		if (!sesion.ok) return sesion.response;

		const usuarioId = locals.usuario!.id_usuario!;

		const verificacion = await prisma.verificacion.findFirst({
			where: { usuario_id: usuarioId },
			orderBy: [{ created_at: 'desc' }, { id_verificacion: 'desc' }],
			include: {
				documentos: {
					orderBy: [{ created_at: 'desc' }, { id_archivo: 'desc' }]
				}
			}
		});

		const archivos =
			verificacion?.documentos && verificacion.documentos.length > 0
				? await Promise.all(
						verificacion.documentos.map(async (doc) => {
							const signed = await supabaseAdmin.storage
								.from('documentos-privados')
								.createSignedUrl(doc.url, 60 * 15);

							return {
								id_archivo: doc.id_archivo,
								nombre_original: doc.nombre_original ?? null,
								url: signed.data?.signedUrl ?? doc.url,
								tipo_mime: doc.tipo_mime ?? null,
								tamanio_bytes: doc.tamanio_bytes ?? null,
								created_at: doc.created_at?.toISOString() ?? null
							};
						})
					)
				: [];

		return json({
			success: true,
			data: {
				verificacion: verificacion
					? {
							id_verificacion: verificacion.id_verificacion,
							estado: verificacion.estado,
							created_at: verificacion.created_at?.toISOString() ?? null
						}
					: null,
				archivos
			}
		});
	} catch (error) {
		console.error('Error al obtener documentación de verificación:', error);
		return json(
			{
				success: false,
				error: 'Error interno al obtener documentación de verificación.'
			},
			{ status: 500 }
		);
	}
};

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

export const DELETE: RequestHandler = async ({ request, locals }) => {
	try {
		const sesion = validarInstitucionSesion(locals.usuario);
		if (!sesion.ok) return sesion.response;

		const usuarioId = locals.usuario!.id_usuario!;
		const body = await request.json().catch(() => ({}));
		const idArchivo = Number(body?.id_archivo);

		if (!idArchivo) {
			return json(
				{ success: false, error: 'Debés indicar el archivo a eliminar.' },
				{ status: 400 }
			);
		}

		const archivo = await prisma.archivo.findUnique({
			where: { id_archivo: idArchivo },
			include: { verificacion: true }
		});

		if (!archivo || !archivo.verificacion_id || !archivo.verificacion) {
			return json(
				{ success: false, error: 'El archivo no pertenece a documentación de verificación.' },
				{ status: 404 }
			);
		}

		if (archivo.verificacion.usuario_id !== usuarioId || archivo.usuario_id !== usuarioId) {
			return json(
				{ success: false, error: 'No tenés permisos para eliminar este archivo.' },
				{ status: 403 }
			);
		}

		const { error: storageError } = await supabaseAdmin.storage
			.from('documentos-privados')
			.remove([archivo.url]);

		if (storageError) {
			console.error('Error al eliminar archivo de storage:', storageError);
		}

		await prisma.archivo.delete({
			where: { id_archivo: idArchivo }
		});

		return json({
			success: true,
			message: 'Archivo eliminado correctamente.'
		});
	} catch (error) {
		console.error('Error al eliminar archivo de verificación:', error);
		return json(
			{
				success: false,
				error: 'Error interno al eliminar el archivo.'
			},
			{ status: 500 }
		);
	}
};
