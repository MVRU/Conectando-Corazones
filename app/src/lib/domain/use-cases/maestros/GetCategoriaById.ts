import type { Categoria } from '../../entities/Categoria';
import type { CategoriaRepository } from '../../repositories/CategoriaRepository';

export class GetCategoriaById {
	constructor(private categoriaRepo: CategoriaRepository) {}

	async execute(id: number): Promise<Categoria | null> {
		return this.categoriaRepo.findById(id);
	}
}
