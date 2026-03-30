import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServicioPanelAdmin } from '$lib/server/servicio-panel-admin';

const service = new ServicioPanelAdmin();

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.usuario?.rol !== 'administrador') {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const reportes = await service.getReportes();
	return json(reportes);
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (locals.usuario?.rol !== 'administrador' || !locals.usuario.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	try {
		const body = await request.json();
		const reporteId = Number(body.reporteId);
		const accion = String(body.accion ?? '');
		const comentario = typeof body.comentario === 'string' ? body.comentario : undefined;

		if (!reporteId || Number.isNaN(reporteId)) {
			return json({ error: 'reporteId inválido' }, { status: 400 });
		}
		if (!['desestimar', 'inhabilitar_cuenta', 'forzar_baja_proyecto'].includes(accion)) {
			return json({ error: 'Acción inválida' }, { status: 400 });
		}

		await service.resolverReporte({
			reporteId,
			accion: accion as 'desestimar' | 'inhabilitar_cuenta' | 'forzar_baja_proyecto',
			comentario,
			adminId: locals.usuario.id_usuario
		});

		return json({ success: true });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'No se pudo resolver el reporte' },
			{ status: 400 }
		);
	}
};
