import { json } from '@sveltejs/kit';
import { EnviarMensaje } from '$lib/domain/use-cases/chat/EnviarMensaje';
import { PostgresChatRepository } from '$lib/infrastructure/supabase/postgres/chat.repo';
import { ChatAccessError, validarAccesoChatProyecto } from '$lib/server/chat.service';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const proyectoId = Number(params.id);
	if (!Number.isInteger(proyectoId) || proyectoId <= 0) {
		return json({ error: 'ID de proyecto inválido' }, { status: 400 });
	}

	const usuario = locals.usuario;
	if (!usuario?.id_usuario) {
		return json({ error: 'No autenticado' }, { status: 401 });
	}

	let payload: { contenido?: unknown; clientId?: unknown };
	try {
		payload = (await request.json()) as { contenido?: unknown; clientId?: unknown };
	} catch {
		return json({ error: 'Payload inválido' }, { status: 400 });
	}

	const contenido =
		typeof payload.contenido === 'string' ? payload.contenido.trim() : '';
	const clientId = typeof payload.clientId === 'string' ? payload.clientId.trim() : '';

	if (!contenido) {
		return json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });
	}

	if (!clientId) {
		return json({ error: 'Falta el identificador del mensaje' }, { status: 400 });
	}

	try {
		await validarAccesoChatProyecto(proyectoId, usuario.id_usuario);

		const chatRepo = new PostgresChatRepository();
		const enviarMensaje = new EnviarMensaje(chatRepo);
		const mensaje = await enviarMensaje.ejecutar(
			proyectoId,
			usuario.id_usuario,
			contenido,
			clientId
		);

		return json({ mensaje });
	} catch (err) {
		if (err instanceof ChatAccessError) {
			const status =
				err.code === 'not_found' ? 404 : err.code === 'not_enabled' ? 409 : 403;
			return json({ error: err.message }, { status });
		}

		console.error('Error enviando mensaje de chat:', err);
		return json(
			{
				error: 'No se pudo registrar el mensaje por un problema de conexión'
			},
			{ status: 503 }
		);
	}
};
