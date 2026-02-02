import type { TipoParticipacion } from '../../entities/TipoParticipacion';
import type { TipoParticipacionRepository } from '../../repositories/TipoParticipacionRepository';

export class GetAllTiposParticipacion {
	constructor(private tipoRepo: TipoParticipacionRepository) {}

	async execute(): Promise<TipoParticipacion[]> {
		return this.tipoRepo.findAll();
	}
}
