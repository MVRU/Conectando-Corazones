import type { Chat, Mensaje } from '../types/Chat';

export interface ChatRepository {
	obtenerChatsPorUsuario(idUsuario: number): Promise<Chat[]>;
	obtenerChatPorProyecto(idProyecto: number): Promise<Chat | null>;
	enviarMensaje(idChat: number, idRemitente: number, contenido: string): Promise<Mensaje>;
}
