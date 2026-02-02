import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class ActualizarEstadoColaboracion {
	constructor(private colaboracionRepository: ColaboracionRepository) {}

	async execute(
		id: number,
		nuevoEstado: 'aprobada' | 'rechazada',
		justificacion?: string
	): Promise<Colaboracion> {
		const colaboracion = await this.colaboracionRepository.findById(id);

		if (!colaboracion) {
			throw new Error('Colaboración no encontrada');
		}

		const colaboracionEntity = new Colaboracion(colaboracion);

		if (nuevoEstado === 'aprobada') {
			colaboracionEntity.aprobar(justificacion);
		} else if (nuevoEstado === 'rechazada') {
			if (!justificacion) {
				throw new Error('Se requiere justificación para rechazar');
			}
			colaboracionEntity.rechazar(justificacion);
		}

		return await this.colaboracionRepository.update(id, {
			estado: colaboracionEntity.estado,
			justificacion: colaboracionEntity.justificacion
		});
	}
}
