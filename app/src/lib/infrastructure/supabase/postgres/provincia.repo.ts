// Repositorio de Provincias - Implementación con Prisma
import type { ProvinciaRepository } from '$lib/domain/repositories/ProvinciaRepository';
import type { Provincia } from '$lib/domain/entities/Provincia';
import { prisma } from '$lib/infrastructure/prisma/client';
import { mapProvinciaToDomain } from './mappers/provincia.mapper';
import { cache } from '$lib/infrastructure/cache/cache.service';

export class ProvinciaRepoPrisma implements ProvinciaRepository {
	private readonly CACHE_KEY = 'provincias:all';
	private readonly CACHE_TTL = 600000; // 10 minutos

	async findAll(): Promise<Provincia[]> {
		// Intentar obtener del caché
		const cached = cache.get<Provincia[]>(this.CACHE_KEY);
		if (cached) return cached;

		// Si no está en caché, consultar DB
		const data = await prisma.provincia.findMany({
			orderBy: { nombre: 'asc' }
		});
		const result = data.map(mapProvinciaToDomain);

		// Guardar en caché
		cache.set(this.CACHE_KEY, result, this.CACHE_TTL);
		return result;
	}

	async findById(id: number): Promise<Provincia | null> {
		const data = await prisma.provincia.findUnique({
			where: { id_provincia: id }
		});
		return data ? mapProvinciaToDomain(data) : null;
	}
}
