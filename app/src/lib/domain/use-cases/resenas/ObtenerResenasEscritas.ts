import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/entities/Resena';

export class ObtenerResenasEscritas {
	constructor(private resenaRepository: ResenaRepository) {}

	async execute(autorId: number): Promise<Resena[]> {
		return await this.resenaRepository.findByAutor(autorId);
	}
}
