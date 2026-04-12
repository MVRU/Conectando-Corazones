import { Prisma } from '@prisma/client';
import { prisma, type PrismaDbClient } from '$lib/infrastructure/prisma/client';
import type { ChatRepository } from '$lib/domain/repositories/ChatRepository';
import type { Chat, Mensaje, ParticipanteChat } from '$lib/domain/types/Chat';

const participanteSelect = {
	id_usuario: true,
	username: true,
	nombre: true,
	apellido: true,
	rol: true,
	nombre_legal: true
} satisfies Prisma.UsuarioSelect;

const mensajeSelect = {
	id_mensaje_chat: true,
	proyecto_id: true,
	autor_id: true,
	client_id: true,
	contenido: true,
	created_at: true,
	autor: {
		select: participanteSelect
	}
} satisfies Prisma.MensajeChatSelect;

type ParticipanteRow = Prisma.UsuarioGetPayload<{ select: typeof participanteSelect }>;
type MensajeRow = Prisma.MensajeChatGetPayload<{ select: typeof mensajeSelect }>;

export class PostgresChatRepository implements ChatRepository {
	constructor(private readonly db: PrismaDbClient = prisma) {}

	async obtenerChatsPorUsuario(idUsuario: number): Promise<Chat[]> {
		const proyectos = await this.db.proyecto.findMany({
			where: {
				OR: [
					{
						institucion_id: idUsuario,
						colaboraciones: {
							some: {
								estado: 'aprobada'
							}
						}
					},
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
			select: {
				id_proyecto: true,
				titulo: true,
				created_at: true,
				updated_at: true,
				institucion_id: true,
				institucion: {
					select: participanteSelect
				},
				estado: {
					select: {
						descripcion: true
					}
				},
				colaboraciones: {
					where: { estado: 'aprobada' },
					select: {
						colaborador_id: true,
						colaborador: {
							select: participanteSelect
						}
					}
				},
				mensajes_chat: {
					orderBy: [{ created_at: 'desc' }, { id_mensaje_chat: 'desc' }],
					take: 1,
					select: mensajeSelect
				},
				_count: {
					select: {
						mensajes_chat: true
					}
				}
			}
		});

		return proyectos
			.map((proyecto) => {
				const participantes = this.mapParticipantes(
					proyecto.institucion,
					proyecto.colaboraciones
						.map((colaboracion) => colaboracion.colaborador)
						.filter((colaborador): colaborador is ParticipanteRow => !!colaborador)
				);
				const ultimoMensaje = proyecto.mensajes_chat[0];
				const updatedAt = ultimoMensaje?.created_at ?? proyecto.updated_at ?? proyecto.created_at;

				return {
					id_chat: proyecto.id_proyecto,
					proyecto_id: proyecto.id_proyecto,
					titulo: proyecto.titulo,
					participantes_ids: participantes.map((participante) => participante.id_usuario),
					participantes,
					mensajes: ultimoMensaje ? [this.mapMensaje(ultimoMensaje)] : [],
					cantidad_mensajes: proyecto._count.mensajes_chat,
					updated_at: updatedAt,
					created_at: proyecto.created_at,
					estado_proyecto: proyecto.estado?.descripcion as Chat['estado_proyecto']
				} satisfies Chat;
			})
			.sort(
				(a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
			);
	}

	async obtenerChatPorProyecto(idProyecto: number): Promise<Chat | null> {
		const proyecto = await this.db.proyecto.findUnique({
			where: { id_proyecto: idProyecto },
			select: {
				id_proyecto: true,
				titulo: true,
				created_at: true,
				updated_at: true,
				institucion_id: true,
				institucion: {
					select: participanteSelect
				},
				estado: {
					select: {
						descripcion: true
					}
				},
				colaboraciones: {
					where: { estado: 'aprobada' },
					select: {
						colaborador_id: true,
						colaborador: {
							select: participanteSelect
						}
					}
				},
				mensajes_chat: {
					orderBy: [{ created_at: 'asc' }, { id_mensaje_chat: 'asc' }],
					select: mensajeSelect
				}
			}
		});

		if (!proyecto || proyecto.colaboraciones.length === 0) {
			return null;
		}

		const participantes = this.mapParticipantes(
			proyecto.institucion,
			proyecto.colaboraciones
				.map((colaboracion) => colaboracion.colaborador)
				.filter((colaborador): colaborador is ParticipanteRow => !!colaborador)
		);
		const mensajes = proyecto.mensajes_chat.map((mensaje) => this.mapMensaje(mensaje));
		const updatedAt =
			mensajes[mensajes.length - 1]?.created_at ?? proyecto.updated_at ?? proyecto.created_at;

		return {
			id_chat: proyecto.id_proyecto,
			proyecto_id: proyecto.id_proyecto,
			titulo: proyecto.titulo,
			participantes_ids: participantes.map((participante) => participante.id_usuario),
			participantes,
			mensajes,
			cantidad_mensajes: mensajes.length,
			updated_at: updatedAt,
			created_at: proyecto.created_at,
			estado_proyecto: proyecto.estado?.descripcion as Chat['estado_proyecto']
		};
	}

	async enviarMensaje(
		idChat: number,
		idRemitente: number,
		contenido: string,
		clientId: string
	): Promise<Mensaje> {
		const mensaje = await this.db.mensajeChat.upsert({
			where: {
				proyecto_id_client_id: {
					proyecto_id: idChat,
					client_id: clientId
				}
			},
			update: {},
			create: {
				proyecto_id: idChat,
				autor_id: idRemitente,
				client_id: clientId,
				contenido: contenido.trim()
			},
			select: mensajeSelect
		});

		return this.mapMensaje(mensaje);
	}

	private mapParticipantes(
		institucion: ParticipanteRow | null,
		colaboradores: ParticipanteRow[]
	): ParticipanteChat[] {
		const participantes = [institucion, ...colaboradores].filter(
			(participante): participante is ParticipanteRow => !!participante
		);
		const vistos = new Set<number>();

		return participantes.filter((participante) => {
			if (vistos.has(participante.id_usuario)) {
				return false;
			}

			vistos.add(participante.id_usuario);
			return true;
		});
	}

	private mapMensaje(mensaje: MensajeRow): Mensaje {
		return {
			id_mensaje: mensaje.id_mensaje_chat,
			chat_id: mensaje.proyecto_id,
			proyecto_id: mensaje.proyecto_id,
			remitente_id: mensaje.autor_id,
			contenido: mensaje.contenido,
			client_id: mensaje.client_id,
			created_at: mensaje.created_at,
			autor: mensaje.autor
		};
	}
}
