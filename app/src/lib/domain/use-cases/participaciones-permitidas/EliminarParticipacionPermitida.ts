import type { ParticipacionPermitidaRepository } from '../../repositories/ParticipacionPermitidaRepository';

export class EliminarParticipacionPermitida {
	constructor(private repository: ParticipacionPermitidaRepository) {}

	async execute(id: number): Promise<void> {
		await this.repository.delete(id);
	}
}
