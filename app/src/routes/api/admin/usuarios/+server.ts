import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServicioPanelAdmin } from '$lib/server/servicio-panel-admin';

const service = new ServicioPanelAdmin();

export const GET: RequestHandler = async ({ locals, url }) => {
	if (locals.usuario?.rol !== 'administrador') {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const rol = url.searchParams.get('rol') || undefined;
	const estadoGestion = url.searchParams.get('estado') || undefined;
	const fechaAltaDesdeRaw = url.searchParams.get('fechaAltaDesde');
	const fechaAltaHastaRaw = url.searchParams.get('fechaAltaHasta');

	const usuarios = await service.getUsuarios({
		rol,
		estadoGestion:
			estadoGestion === 'activo' || estadoGestion === 'pendiente' || estadoGestion === 'inhabilitado'
				? estadoGestion
				: undefined,
		fechaAltaDesde: fechaAltaDesdeRaw ? new Date(fechaAltaDesdeRaw) : undefined,
		fechaAltaHasta: fechaAltaHastaRaw ? new Date(fechaAltaHastaRaw) : undefined
	});

	return json(usuarios);
};
