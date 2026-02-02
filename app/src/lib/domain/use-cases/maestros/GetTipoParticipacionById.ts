import type { TipoParticipacion } from '../../entities/TipoParticipacion';
import type { TipoParticipacionRepository } from '../../repositories/TipoParticipacionRepository';

export class GetTipoParticipacionById {
	constructor(private tipoRepo: TipoParticipacionRepository) {}

	async execute(id: number): Promise<TipoParticipacion | null> {
		return this.tipoRepo.findById(id);
	}
}
