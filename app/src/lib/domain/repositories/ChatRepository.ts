import type { Chat, Mensaje } from '../types/Chat';

export interface EventoChatActividad {
	proyecto_id: number;
	fecha: Date;
}

export interface ChatRepository {
	obtenerChatsPorUsuario(idUsuario: number): Promise<Chat[]>;
	obtenerChatPorProyecto(idProyecto: number): Promise<Chat | null>;
	enviarMensaje(
		idChat: number,
		idRemitente: number,
		contenido: string,
		clientId: string
	): Promise<Mensaje>;
	obtenerEventosChatDelUsuario(usuarioId: number, desde: Date): Promise<EventoChatActividad[]>;
	obtenerFechaUltimoMensajeAjeno(usuarioId: number): Promise<Date | null>;
}
