import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServicioPanelAdmin } from '$lib/server/servicio-panel-admin';

const service = new ServicioPanelAdmin();

function parseInicioDelDia(fechaIso: string): Date {
	return new Date(`${fechaIso}T00:00:00.000`);
}

function parseFinDelDia(fechaIso: string): Date {
	return new Date(`${fechaIso}T23:59:59.999`);
}

export const GET: RequestHandler = async ({ locals, url }) => {
	if (locals.usuario?.rol !== 'administrador') {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const idObjetoRaw = url.searchParams.get('id_objeto');
	const usuarioIdRaw = url.searchParams.get('usuario_id');
	const tipoObjetoRaw = url.searchParams.get('tipo_objeto');
	const accionRaw = url.searchParams.get('accion');
	const atributoAfectadoRaw = url.searchParams.get('atributo_afectado');
	const fechaDesdeRaw = url.searchParams.get('fecha_desde');
	const fechaHastaRaw = url.searchParams.get('fecha_hasta');
	const textoRaw = url.searchParams.get('texto');
	const pageRaw = url.searchParams.get('page');
	const pageSizeRaw = url.searchParams.get('pageSize');
	const idObjeto = idObjetoRaw ? Number(idObjetoRaw) : undefined;
	const usuarioId = usuarioIdRaw ? Number(usuarioIdRaw) : undefined;
	const fechaDesde = fechaDesdeRaw ? parseInicioDelDia(fechaDesdeRaw) : undefined;
	const fechaHasta = fechaHastaRaw ? parseFinDelDia(fechaHastaRaw) : undefined;
	const page = pageRaw ? Number(pageRaw) : 1;
	const pageSize = pageSizeRaw ? Number(pageSizeRaw) : 100;

	if (idObjetoRaw && (idObjeto === undefined || Number.isNaN(idObjeto))) {
		return json({ error: 'id_objeto debe ser numérico' }, { status: 400 });
	}
	if (usuarioIdRaw && (usuarioId === undefined || Number.isNaN(usuarioId))) {
		return json({ error: 'usuario_id debe ser numérico' }, { status: 400 });
	}
	if (fechaDesdeRaw && (!fechaDesde || Number.isNaN(fechaDesde.getTime()))) {
		return json({ error: 'fecha_desde debe tener formato válido YYYY-MM-DD' }, { status: 400 });
	}
	if (fechaHastaRaw && (!fechaHasta || Number.isNaN(fechaHasta.getTime()))) {
		return json({ error: 'fecha_hasta debe tener formato válido YYYY-MM-DD' }, { status: 400 });
	}
	if (Number.isNaN(page) || page < 1) {
		return json({ error: 'page debe ser un número positivo' }, { status: 400 });
	}
	if (Number.isNaN(pageSize) || pageSize < 1) {
		return json({ error: 'pageSize debe ser un número positivo' }, { status: 400 });
	}

	const rows = await service.getAuditoria({
		idObjeto,
		usuarioId,
		tipoObjeto: tipoObjetoRaw?.trim() || undefined,
		accion: accionRaw?.trim() || undefined,
		atributoAfectado: atributoAfectadoRaw?.trim() || undefined,
		fechaDesde,
		fechaHasta,
		texto: textoRaw?.trim() || undefined,
		page,
		pageSize
	});
	return json(rows);
};
