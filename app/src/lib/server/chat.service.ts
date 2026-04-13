import { prisma } from '$lib/infrastructure/prisma/client';
import type { ParticipanteChat } from '$lib/domain/types/Chat';

export type ChatAccessErrorCode = 'not_found' | 'not_enabled' | 'forbidden';

export class ChatAccessError extends Error {
	constructor(
		public readonly code: ChatAccessErrorCode,
		message: string,
		public readonly proyectoId: number
	) {
		super(message);
	}
}

interface ChatAccessContext {
	proyectoId: number;
	titulo: string;
	estado: string | null;
	esDuenoDelProyecto: boolean;
	participantes: ParticipanteChat[];
}

export async function validarAccesoChatProyecto(
	proyectoId: number,
	usuarioId: number
): Promise<ChatAccessContext> {
	const proyecto = await prisma.proyecto.findUnique({
		where: { id_proyecto: proyectoId },
		select: {
			id_proyecto: true,
			titulo: true,
			institucion_id: true,
			institucion: {
				select: {
					id_usuario: true,
					username: true,
					nombre: true,
					apellido: true,
					rol: true,
					nombre_legal: true
				}
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
						select: {
							id_usuario: true,
							username: true,
							nombre: true,
							apellido: true,
							rol: true,
							nombre_legal: true
						}
					}
				}
			}
		}
	});

	if (!proyecto) {
		throw new ChatAccessError('not_found', 'Proyecto no encontrado', proyectoId);
	}

	const colaboradoresAprobados = proyecto.colaboraciones
		.map((colaboracion) => colaboracion.colaborador)
		.filter(
			(colaborador): colaborador is NonNullable<(typeof proyecto.colaboraciones)[number]['colaborador']> =>
				!!colaborador
		);

	const participantes = [proyecto.institucion, ...colaboradoresAprobados].filter(
		(participante, index, all) =>
			!!participante &&
			all.findIndex((candidate) => candidate?.id_usuario === participante.id_usuario) === index
	);

	if (proyecto.colaboraciones.length === 0) {
		throw new ChatAccessError(
			'not_enabled',
			'Aún no hay colaboradores aprobados para habilitar este chat',
			proyectoId
		);
	}

	const esDuenoDelProyecto = proyecto.institucion_id === usuarioId;
	const esColaboradorAprobado = proyecto.colaboraciones.some(
		(colaboracion) => colaboracion.colaborador_id === usuarioId
	);

	if (!esDuenoDelProyecto && !esColaboradorAprobado) {
		throw new ChatAccessError('forbidden', 'No tenés acceso a este chat', proyectoId);
	}

	return {
		proyectoId: proyecto.id_proyecto,
		titulo: proyecto.titulo,
		estado: proyecto.estado?.descripcion ?? null,
		esDuenoDelProyecto,
		participantes
	};
}
