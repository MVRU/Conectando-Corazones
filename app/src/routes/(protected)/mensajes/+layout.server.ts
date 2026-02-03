import { PostgresChatRepository } from '$lib/infrastructure/supabase/postgres/chat.repo';
import { ObtenerChatsPorUsuario } from '$lib/domain/use-cases/chat/ObtenerChatsPorUsuario';
import type { LayoutServerLoad } from './$types';

export const load: any = async ({ locals }: any) => {
	const usuario = locals.usuario;
	if (!usuario) return { chats: [] };

	const chatRepo = new PostgresChatRepository();
	const useCase = new ObtenerChatsPorUsuario(chatRepo);
	const chats = await useCase.ejecutar(usuario.id_usuario);

	return {
		chats: JSON.parse(JSON.stringify(chats))
	};
};
