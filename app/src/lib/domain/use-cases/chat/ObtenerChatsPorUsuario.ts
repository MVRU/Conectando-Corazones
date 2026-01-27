import type { Chat } from '$lib/domain/types/Chat';
import type { ChatRepository } from '$lib/domain/repositories/ChatRepository';

export class ObtenerChatsPorUsuario {
	constructor(private repositorioChat: ChatRepository) {}

	async ejecutar(idUsuario: number): Promise<Chat[]> {
		return await this.repositorioChat.obtenerChatsPorUsuario(idUsuario);
	}
}
