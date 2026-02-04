import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';
import { prisma } from '$lib/infrastructure/prisma/client';

export class ActualizarEstadoColaboracion {
	constructor(
		private colaboracionRepository: ColaboracionRepository,
		private proyectoRepository: ProyectoRepository,
		private historialRepository: HistorialDeCambiosRepository
	) {}

	async execute(
		id: number,
		nuevoEstado: 'aprobada' | 'rechazada',
		usuarioId: number,
		justificacion?: string
	): Promise<Colaboracion> {
		// Validar que la colaboración existe
		const colaboracion = await this.colaboracionRepository.findById(id);
		if (!colaboracion) {
			throw new Error('Colaboración no encontrada');
		}

		// Validar que el proyecto existe y está en estado "en_curso"
		const proyecto = await this.proyectoRepository.findById(colaboracion.proyecto_id!);
		if (!proyecto) {
			throw new Error('Proyecto no encontrado');
		}

		if (proyecto.estado !== 'en_curso') {
			throw new Error(
				'Solo se pueden aprobar/rechazar colaboraciones de proyectos en estado "En curso"'
			);
		}

		// Crear entidad y validar estado
		const colaboracionEntity = new Colaboracion(colaboracion);
		const estadoAnterior = colaboracionEntity.estado;

		// Aplicar cambio de estado
		if (nuevoEstado === 'aprobada') {
			colaboracionEntity.aprobar(justificacion);
		} else if (nuevoEstado === 'rechazada') {
			if (!justificacion) {
				throw new Error('Se requiere justificación para rechazar');
			}
			colaboracionEntity.rechazar(justificacion);
		}

		// Ejecutar todo en una transacción atómica
		return await prisma.$transaction(async (tx) => {
			// 1. Actualizar colaboración
			const updated = await tx.colaboracion.update({
				where: { id_colaboracion: id },
				data: {
					estado: colaboracionEntity.estado,
					justificacion: colaboracionEntity.justificacion
				},
				include: {
					colaborador: {
						include: {
							contactos: true
						}
					},
					proyecto: {
						include: {
							estado: true
						}
					}
				}
			});

			// 2. Si se aprueba, habilitar chat si no existe
			if (nuevoEstado === 'aprobada') {
				// Solo crear chat si no existe
				if (!proyecto.id_chat_firebase) {
					// Generar un ID único para el chat (puede ser mejorado con UUID)
					const chatId = `chat_proyecto_${proyecto.id_proyecto}_${Date.now()}`;

					await tx.proyecto.update({
						where: { id_proyecto: proyecto.id_proyecto },
						data: { id_chat_firebase: chatId }
					});
				}
			}

			// 3. Registrar en historial de cambios
			await this.historialRepository.create(
				{
					tipo_objeto: 'colaboracion',
					id_objeto: id,
					accion: nuevoEstado === 'aprobada' ? 'aprobar' : 'rechazar',
					atributo_afectado: 'estado',
					valor_anterior: estadoAnterior,
					valor_nuevo: nuevoEstado,
					justificacion: justificacion,
					usuario_id: usuarioId
				},
				tx
			);

			// Mapear resultado a entidad Colaboracion
			return new Colaboracion({
				id_colaboracion: updated.id_colaboracion,
				estado: updated.estado as any,
				justificacion: updated.justificacion || undefined,
				created_at: updated.created_at || undefined,
				mensaje: updated.mensaje || undefined,
				proyecto_id: updated.proyecto_id || undefined,
				colaborador_id: updated.colaborador_id || undefined,
				colaborador: updated.colaborador as any
			});
		});
	}
}
