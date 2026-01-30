import type { CategoriaRepository } from '$lib/domain/repositories/CategoriaRepository';
import type { Categoria } from '$lib/domain/entities/Categoria';
import { prisma } from '$lib/infrastructure/prisma/client';
import { CategoriaMapper } from './mappers/categoria.mapper';

import { cache } from '$lib/infrastructure/cache/cache.service';

export class PostgresCategoriaRepository implements CategoriaRepository {
	private readonly CACHE_KEY = 'categorias:all';
	private readonly CACHE_TTL = 600000; // 10 minutos

	async findAll(): Promise<Categoria[]> {
		// Intentar obtener del caché
		const cached = cache.get<Categoria[]>(this.CACHE_KEY);
		if (cached) return cached;

		// Si no está en caché, consultar DB
		const categorias = await prisma.categoria.findMany();
		const result = categorias.map((c) => CategoriaMapper.toDomain(c));

		// Guardar en caché
		cache.set(this.CACHE_KEY, result, this.CACHE_TTL);
		return result;
	}

	async findById(id: number): Promise<Categoria | null> {
		const categoria = await prisma.categoria.findUnique({
			where: { id_categoria: id }
		});
		return categoria ? CategoriaMapper.toDomain(categoria) : null;
	}
}
