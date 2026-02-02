import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class ListarColaboracionesPorColaborador {
	constructor(private colaboracionRepository: ColaboracionRepository) {}

	async execute(colaboradorId: number): Promise<Colaboracion[]> {
		return await this.colaboracionRepository.findByColaborador(colaboradorId);
	}
}
