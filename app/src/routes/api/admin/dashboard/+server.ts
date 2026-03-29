import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServicioPanelAdmin } from '$lib/server/servicio-panel-admin';

const service = new ServicioPanelAdmin();

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.usuario?.rol !== 'administrador') {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const kpis = await service.getKpis();
	return json(kpis);
};
