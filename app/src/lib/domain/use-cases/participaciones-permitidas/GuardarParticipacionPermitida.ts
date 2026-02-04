import type { ParticipacionPermitida } from '../../entities/ParticipacionPermitida';
import type { ParticipacionPermitidaRepository } from '../../repositories/ParticipacionPermitidaRepository';

export class GuardarParticipacionPermitida {
	constructor(private repository: ParticipacionPermitidaRepository) {}

	async execute(participacion: ParticipacionPermitida): Promise<ParticipacionPermitida> {
		return await this.repository.save(participacion);
	}
}
