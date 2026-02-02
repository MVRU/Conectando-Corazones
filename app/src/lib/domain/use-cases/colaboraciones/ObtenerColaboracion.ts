import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class ObtenerColaboracion {
	constructor(private colaboracionRepository: ColaboracionRepository) {}

	async execute(id: number): Promise<Colaboracion | null> {
		return await this.colaboracionRepository.findById(id);
	}
}
