import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresChatRepository } from '$lib/infrastructure/supabase/postgres/chat.repo';
import { ObtenerChatPorProyecto } from '$lib/domain/use-cases/chat/ObtenerChatPorProyecto';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const proyectoRepo = new PostgresProyectoRepository();
	const chatRepo = new PostgresChatRepository();
	const obtenerChatUseCase = new ObtenerChatPorProyecto(chatRepo);

	const proyectoId = Number(params.proyecto_id);
	// @ts-ignore
	const proyecto = await proyectoRepo.findById(proyectoId);

	if (!proyecto) throw error(404, 'Proyecto no encontrado');

	const chat = await obtenerChatUseCase.ejecutar(proyectoId);

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		chat: chat ? JSON.parse(JSON.stringify(chat)) : null
	};
};
