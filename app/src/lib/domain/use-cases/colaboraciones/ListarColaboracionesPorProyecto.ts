import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class ListarColaboracionesPorProyecto {
	constructor(private colaboracionRepository: ColaboracionRepository) {}

	async execute(proyectoId: number): Promise<Colaboracion[]> {
		return await this.colaboracionRepository.findByProyecto(proyectoId);
	}
}
