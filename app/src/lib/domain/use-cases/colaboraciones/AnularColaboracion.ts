import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class AnularColaboracion {
	constructor(private colaboracionRepository: ColaboracionRepository) {}

	async execute(id: number): Promise<Colaboracion> {
		const colaboracion = await this.colaboracionRepository.findById(id);

		if (!colaboracion) {
			throw new Error('Colaboración no encontrada');
		}

		const colaboracionEntity = new Colaboracion(colaboracion);
		colaboracionEntity.anular();

		return await this.colaboracionRepository.update(id, {
			estado: colaboracionEntity.estado
		});
	}
}
