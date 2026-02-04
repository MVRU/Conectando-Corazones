import type { ParticipacionPermitida } from '../../entities/ParticipacionPermitida';
import type { ParticipacionPermitidaRepository } from '../../repositories/ParticipacionPermitidaRepository';

export class ObtenerParticipacionPorId {
	constructor(private repository: ParticipacionPermitidaRepository) {}

	async execute(id: number): Promise<ParticipacionPermitida | null> {
		return await this.repository.findById(id);
	}
}
