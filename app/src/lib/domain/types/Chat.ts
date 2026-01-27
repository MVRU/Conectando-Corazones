export interface Mensaje {
	id_mensaje: number;
	chat_id: number;
	remitente_id: number;
	contenido: string;
	created_at: Date;
}

export interface Chat {
	id_chat: number;
	proyecto_id: number;
	titulo: string; // Título del proyecto
	participantes_ids: number[]; // IDs de usuarios con acceso (institución y colaboradores)
	mensajes: Mensaje[];
	updated_at: Date; // Para ordenar en la sidebar
	created_at: Date;
}
