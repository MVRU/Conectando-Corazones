import { error, redirect } from '@sveltejs/kit';
import { PostgresChatRepository } from '$lib/infrastructure/supabase/postgres/chat.repo';
import { ChatAccessError, validarAccesoChatProyecto } from '$lib/server/chat.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const proyectoId = Number(params.proyecto_id);

	if (!Number.isInteger(proyectoId) || proyectoId <= 0) {
		throw error(400, 'ID de proyecto inválido');
	}

	const usuario = locals.usuario;
	if (!usuario?.id_usuario) {
		throw error(401, 'Debés iniciar sesión para acceder al chat');
	}

	try {
		const acceso = await validarAccesoChatProyecto(proyectoId, usuario.id_usuario);
		const chatRepo = new PostgresChatRepository();
		const chat = await chatRepo.obtenerChatPorProyecto(proyectoId);

		if (!chat) {
			throw redirect(303, `/proyectos/${proyectoId}?chat=no-habilitado`);
		}

		return {
			proyecto: {
				id_proyecto: acceso.proyectoId,
				titulo: acceso.titulo,
				estado: acceso.estado
			},
			chat: JSON.parse(JSON.stringify(chat)),
			tieneAcceso: true,
			esDuenoDelProyecto: acceso.esDuenoDelProyecto
		};
	} catch (err) {
		if (err instanceof ChatAccessError) {
			if (err.code === 'not_found') {
				throw error(404, err.message);
			}

			if (err.code === 'not_enabled') {
				throw redirect(303, `/proyectos/${proyectoId}?chat=no-habilitado`);
			}

			throw error(403, err.message);
		}

		throw err;
	}
};
