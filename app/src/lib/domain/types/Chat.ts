import type { EstadoDescripcion } from './Estado';

export interface ParticipanteChat {
	id_usuario: number;
	username: string;
	nombre: string;
	apellido: string;
	rol: string;
	nombre_legal?: string | null;
}

export interface Mensaje {
	id_mensaje: number;
	chat_id: number;
	proyecto_id: number;
	remitente_id: number;
	contenido: string;
	client_id: string;
	created_at: Date | string;
	autor?: ParticipanteChat;
}

export interface Chat {
	id_chat: number;
	proyecto_id: number;
	titulo: string; // Título del proyecto
	participantes_ids: number[]; // IDs de usuarios con acceso (institución y colaboradores)
	participantes: ParticipanteChat[];
	mensajes: Mensaje[];
	cantidad_mensajes: number;
	updated_at: Date | string; // Para ordenar en la sidebar
	created_at: Date | string;
	estado_proyecto?: EstadoDescripcion;
}
