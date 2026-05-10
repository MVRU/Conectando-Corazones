import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';
import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';

function extraerMotivoRechazo(justificacion: string | null | undefined): string | null {
	if (!justificacion) return null;
	const token = 'Motivo enviado al usuario:';
	const idx = justificacion.indexOf(token);
	if (idx === -1) return null;
	const motivo = justificacion.slice(idx + token.length).trim();
	return motivo || null;
}

/**
 * Carga de datos para la sección de verificación institucional.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario!; // Garantizado por AuthGuard en hooks
	const verificacionActual = await prisma.verificacion.findFirst({
		where: { usuario_id: usuario.id_usuario },
		orderBy: [{ created_at: 'desc' }, { id_verificacion: 'desc' }],
		include: {
			documentos: {
				orderBy: [{ created_at: 'desc' }, { id_archivo: 'desc' }]
			}
		}
	});

	let motivoRechazo: string | null = null;
	if (verificacionActual?.estado === 'rechazada') {
		const historialRechazo = await prisma.historialDeCambios.findFirst({
			where: {
				tipo_objeto: 'Verificacion',
				id_objeto: verificacionActual.id_verificacion,
				atributo_afectado: 'estado',
				valor_nuevo: 'rechazada'
			},
			orderBy: { created_at: 'desc' }
		});
		motivoRechazo = extraerMotivoRechazo(historialRechazo?.justificacion);
	}

	const documentosVerificacion =
		verificacionActual?.documentos && verificacionActual.documentos.length > 0
			? await Promise.all(
					verificacionActual.documentos.map(async (doc) => {
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

	return {
		usuario: usuario.toPOJO(),
		verificacionActual: verificacionActual
			? {
					id_verificacion: verificacionActual.id_verificacion,
					estado: verificacionActual.estado,
					created_at: verificacionActual.created_at?.toISOString() ?? null
				}
			: null,
		motivoRechazo,
		documentosVerificacion
	};
};
