import type { ParticipacionPermitida } from '../../entities/ParticipacionPermitida';
import type { ParticipacionPermitidaRepository } from '../../repositories/ParticipacionPermitidaRepository';

export class ListarParticipacionesPorProyecto {
	constructor(private repository: ParticipacionPermitidaRepository) {}

	async execute(id_proyecto: number): Promise<ParticipacionPermitida[]> {
		return await this.repository.findAllByProyecto(id_proyecto);
	}
}
