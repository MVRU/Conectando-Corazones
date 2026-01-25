import type { ChatRepository } from '$lib/domain/repositories/ChatRepository';
import type { Chat, Mensaje } from '$lib/domain/types/Chat';
import { mockChats } from '../../mocks/mock-chats';

export class MockChatRepository implements ChatRepository {
	async obtenerChatsPorUsuario(idUsuario: number): Promise<Chat[]> {
		await new Promise((resolve) => setTimeout(resolve, 300));

		return mockChats
			.filter((chat: Chat) => chat.participantes_ids.includes(idUsuario))
			.map((chat: Chat) => ({ ...chat }))
			.sort((a: Chat, b: Chat) => b.updated_at.getTime() - a.updated_at.getTime());
	}

	async obtenerChatPorProyecto(idProyecto: number): Promise<Chat | null> {
		await new Promise((resolve) => setTimeout(resolve, 200));

		const chat = mockChats.find((c: Chat) => c.proyecto_id === idProyecto);
		return chat ? { ...chat } : null;
	}

	async enviarMensaje(idChat: number, idRemitente: number, contenido: string): Promise<Mensaje> {
		await new Promise((resolve) => setTimeout(resolve, 400));

		const indiceChat = mockChats.findIndex((c: Chat) => c.id_chat === idChat);
		if (indiceChat === -1) {
			throw new Error('Chat no encontrado');
		}

		const chat = mockChats[indiceChat];

		// Verificar si el usuario es participante
		if (!chat.participantes_ids.includes(idRemitente)) {
			throw new Error('Usuario no autorizado para enviar mensajes en este chat');
		}

		const nuevoMensaje: Mensaje = {
			id_mensaje: Math.floor(Math.random() * 100000), // ID temporal
			chat_id: idChat,
			remitente_id: idRemitente,
			contenido: contenido,
			created_at: new Date()
		};

		// Actualizar el chat en el mock
		chat.mensajes = [...chat.mensajes, nuevoMensaje];
		chat.updated_at = new Date();

		return nuevoMensaje;
	}
}
