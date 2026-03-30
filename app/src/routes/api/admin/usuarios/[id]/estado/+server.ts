import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServicioPanelAdmin } from '$lib/server/servicio-panel-admin';

const service = new ServicioPanelAdmin();

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (locals.usuario?.rol !== 'administrador' || !locals.usuario.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 403 });
	}

	const usuarioId = Number(params.id);
	if (!usuarioId || Number.isNaN(usuarioId)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		const body = await request.json();
		const habilitar = Boolean(body.habilitar);

		await service.cambiarEstadoUsuario({
			usuarioId,
			habilitar,
			adminId: locals.usuario.id_usuario
		});
		return json({ success: true });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'No se pudo actualizar el estado' },
			{ status: 400 }
		);
	}
};
