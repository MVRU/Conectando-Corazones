import { prisma } from '$lib/infrastructure/prisma/client';
import type { ChatRepository } from '$lib/domain/repositories/ChatRepository';
import type { Chat, Mensaje } from '$lib/domain/types/Chat';

export class PostgresChatRepository implements ChatRepository {
	async obtenerChatsPorUsuario(idUsuario: number): Promise<Chat[]> {
		// Encontrar proyectos donde el usuario es la institución o un colaborador aprobado,
		// y asegurar que el proyecto tenga al menos una colaboración aprobada.
		const proyectos = await prisma.proyecto.findMany({
			where: {
				colaboraciones: {
					some: {
						estado: 'aprobada'
					}
				},
				OR: [
					{ institucion_id: idUsuario },
					{
						colaboraciones: {
							some: {
								colaborador_id: idUsuario,
								estado: 'aprobada'
							}
						}
					}
				]
			},
			orderBy: {
				updated_at: 'desc'
			},
			include: {
				estado: true,
				colaboraciones: {
					where: { estado: 'aprobada' },
					select: { colaborador_id: true }
				}
			}
		});

		return proyectos.map((p) => ({
			id_chat: p.id_proyecto,
			proyecto_id: p.id_proyecto,
			titulo: p.titulo,
			participantes_ids: [p.institucion_id, ...p.colaboraciones.map((c) => c.colaborador_id!)],
			mensajes: [],
			updated_at: p.updated_at || p.created_at,
			created_at: p.created_at,
			estado_proyecto: p.estado?.descripcion as any
		}));
	}

	async obtenerChatPorProyecto(idProyecto: number): Promise<Chat | null> {
		const proyecto = await prisma.proyecto.findUnique({
			where: { id_proyecto: idProyecto },
			include: {
				estado: true,
				colaboraciones: {
					where: { estado: 'aprobada' },
					select: { colaborador_id: true }
				}
			}
		});

		if (!proyecto || proyecto.colaboraciones.length === 0) {
			return null;
		}

		return {
			id_chat: proyecto.id_proyecto,
			proyecto_id: proyecto.id_proyecto,
			titulo: proyecto.titulo,
			participantes_ids: [
				proyecto.institucion_id,
				...proyecto.colaboraciones.map((c) => c.colaborador_id!)
			],
			mensajes: [],
			updated_at: proyecto.updated_at || proyecto.created_at,
			created_at: proyecto.created_at,
			estado_proyecto: proyecto.estado?.descripcion as any
		};
	}

	async enviarMensaje(idChat: number, idRemitente: number, contenido: string): Promise<Mensaje> {
		// Mock implementation
		return {
			id_mensaje: Math.floor(Math.random() * 100000),
			chat_id: idChat,
			remitente_id: idRemitente,
			contenido: contenido,
			created_at: new Date()
		};
	}
}
