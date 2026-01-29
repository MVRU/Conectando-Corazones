import type { Categoria } from '../entities/Categoria';

export interface CategoriaRepository {
	findAll(): Promise<Categoria[]>;
	findById(id: number): Promise<Categoria | null>;
}
