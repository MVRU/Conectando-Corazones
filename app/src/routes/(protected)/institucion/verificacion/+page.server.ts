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

async function obtenerMotivoRechazo(idVerificacion: number): Promise<string | null> {
	const historial = await prisma.historialDeCambios.findFirst({
		where: {
			tipo_objeto: 'Verificacion',
			id_objeto: idVerificacion,
			atributo_afectado: 'estado',
			valor_nuevo: 'rechazada'
		},
		orderBy: { created_at: 'desc' }
	});
	return extraerMotivoRechazo(historial?.justificacion);
}

type DocRaw = {
	id_archivo: number;
	nombre_original: string | null;
	url: string;
	tipo_mime: string | null;
	tamanio_bytes: number | null;
	created_at: Date | null;
};

async function firmarDocumentos(docs: DocRaw[]) {
	return Promise.all(
		docs.map(async (doc) => {
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
	);
}

/**
 * Carga de datos para la sección de verificación institucional.
 * La protección de acceso se maneja en hooks.server.ts via AuthGuard.
 */
export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario!;

	const [verificacionInstitucional, verificacionArca] = await Promise.all([
		prisma.verificacion.findFirst({
			where: { usuario_id: usuario.id_usuario, tipo: 'institucional' },
			orderBy: [{ created_at: 'desc' }, { id_verificacion: 'desc' }],
			include: { documentos: { orderBy: [{ created_at: 'desc' }, { id_archivo: 'desc' }] } }
		}),
		prisma.verificacion.findFirst({
			where: { usuario_id: usuario.id_usuario, tipo: 'arca' },
			orderBy: [{ created_at: 'desc' }, { id_verificacion: 'desc' }],
			include: { documentos: { orderBy: [{ created_at: 'desc' }, { id_archivo: 'desc' }] } }
		})
	]);

	const [documentosInstitucional, motivoRechazoInstitucional, motivoRechazoArca, documentoArca] =
		await Promise.all([
			verificacionInstitucional?.documentos?.length
				? firmarDocumentos(verificacionInstitucional.documentos)
				: Promise.resolve([]),
			verificacionInstitucional?.estado === 'rechazada'
				? obtenerMotivoRechazo(verificacionInstitucional.id_verificacion)
				: Promise.resolve(null),
			verificacionArca?.estado === 'rechazada'
				? obtenerMotivoRechazo(verificacionArca.id_verificacion)
				: Promise.resolve(null),
			verificacionArca?.documentos?.[0]
				? firmarDocumentos([verificacionArca.documentos[0]]).then((d) => d[0] ?? null)
				: Promise.resolve(null)
		]);

	return {
		usuario: usuario.toPOJO(),
		verificacionInstitucional: verificacionInstitucional
			? {
					id_verificacion: verificacionInstitucional.id_verificacion,
					estado: verificacionInstitucional.estado,
					created_at: verificacionInstitucional.created_at?.toISOString() ?? null
				}
			: null,
		motivoRechazo: motivoRechazoInstitucional,
		documentosVerificacion: documentosInstitucional,
		verificacionArca: verificacionArca
			? {
					id_verificacion: verificacionArca.id_verificacion,
					estado: verificacionArca.estado,
					fecha_vencimiento: verificacionArca.fecha_vencimiento?.toISOString() ?? null,
					created_at: verificacionArca.created_at?.toISOString() ?? null
				}
			: null,
		motivoRechazoArca,
		documentoArca
	};
};
