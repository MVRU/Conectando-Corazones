import type { Categoria } from '../../entities/Categoria';
import type { CategoriaRepository } from '../../repositories/CategoriaRepository';

export class ListarCategorias {
	constructor(private categoriaRepo: CategoriaRepository) {}

	async execute(): Promise<Categoria[]> {
		return this.categoriaRepo.findAll();
	}
}
