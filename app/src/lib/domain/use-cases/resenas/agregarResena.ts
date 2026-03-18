import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/types/Resena';

export class AgregarResena {
	constructor(private resenaRepository: ResenaRepository) {}

	async execute(resena: Omit<Resena, 'id_resena'>): Promise<Resena> {
		if (!resena.contenido?.trim()) {
			throw new Error('El contenido de la reseña no puede estar vacío.');
		}
		if (resena.puntaje < 1 || resena.puntaje > 5) {
			throw new Error('El puntaje debe estar entre 1 y 5.');
		}

		return await this.resenaRepository.save({
			...resena,
			aprobado: false
		});
	}
}
