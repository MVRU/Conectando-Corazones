import type { Mensaje } from '$lib/domain/types/Chat';
import type { ChatRepository } from '$lib/domain/repositories/ChatRepository';

export class EnviarMensaje {
	constructor(private repositorioChat: ChatRepository) {}

	async ejecutar(
		idChat: number,
		idRemitente: number,
		contenido: string,
		clientId: string
	): Promise<Mensaje> {
		if (!contenido || contenido.trim().length === 0) {
			throw new Error('El contenido del mensaje no puede estar vacío');
		}
		if (!clientId || clientId.trim().length === 0) {
			throw new Error('El identificador del mensaje es requerido');
		}
		return await this.repositorioChat.enviarMensaje(idChat, idRemitente, contenido, clientId);
	}
}
