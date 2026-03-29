import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/types/Resena';
import { Resena as ResenaEntity } from '$lib/domain/entities/Resena';

export class AgregarResena {
	constructor(private resenaRepository: ResenaRepository) {}

	async execute(resena: Omit<Resena, 'id_resena'>): Promise<Resena> {
		const nuevaResena = new ResenaEntity({
			...resena,
			aprobado: false
		});

		return await this.resenaRepository.save(nuevaResena);
	}
}
