import type { Chat } from '$lib/domain/types/Chat';
import type { ChatRepository } from '$lib/domain/repositories/ChatRepository';

export class ObtenerChatPorProyecto {
	constructor(private repositorioChat: ChatRepository) {}

	async ejecutar(idProyecto: number): Promise<Chat | null> {
		return await this.repositorioChat.obtenerChatPorProyecto(idProyecto);
	}
}
