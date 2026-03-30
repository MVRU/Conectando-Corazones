import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServicioPanelAdmin } from '$lib/server/servicio-panel-admin';

const service = new ServicioPanelAdmin();

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.usuario?.rol !== 'administrador') {
		return json({ error: 'No autorizado' }, { status: 403 });
	}
	const solicitudes = await service.getOnboardingPendientes();
	return json(solicitudes);
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (locals.usuario?.rol !== 'administrador' || !locals.usuario.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	try {
		const body = await request.json();
		const idVerificacion = Number(body.idVerificacion);
		const accion = String(body.accion ?? '');
		const motivo = typeof body.motivo === 'string' ? body.motivo : undefined;

		if (!idVerificacion || Number.isNaN(idVerificacion)) {
			return json({ error: 'idVerificacion inválido' }, { status: 400 });
		}
		if (accion !== 'aprobar' && accion !== 'rechazar') {
			return json({ error: 'Acción inválida' }, { status: 400 });
		}

		await service.resolverOnboarding({
			idVerificacion,
			accion,
			motivo,
			adminId: locals.usuario.id_usuario
		});

		return json({ success: true });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Error al resolver onboarding' },
			{ status: 400 }
		);
	}
};
