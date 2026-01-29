import type { CategoriaRepository } from '$lib/domain/repositories/CategoriaRepository';
import type { Categoria } from '$lib/domain/entities/Categoria';
import { prisma } from '$lib/infrastructure/prisma/client';
import { CategoriaMapper } from './mappers/categoria.mapper';

export class PostgresCategoriaRepository implements CategoriaRepository {
	async findAll(): Promise<Categoria[]> {
		const categorias = await prisma.categoria.findMany();
		return categorias.map((c) => CategoriaMapper.toDomain(c));
	}

	async findById(id: number): Promise<Categoria | null> {
		const categoria = await prisma.categoria.findUnique({
			where: { id_categoria: id }
		});
		return categoria ? CategoriaMapper.toDomain(categoria) : null;
	}
}
