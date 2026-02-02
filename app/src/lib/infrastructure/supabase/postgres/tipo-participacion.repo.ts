import type { TipoParticipacionRepository } from '$lib/domain/repositories/TipoParticipacionRepository';
import type { TipoParticipacion } from '$lib/domain/entities/TipoParticipacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { TipoParticipacionMapper } from './mappers/tipo-participacion.mapper';

import { cache } from '$lib/infrastructure/cache/cache.service';

export class PostgresTipoParticipacionRepository implements TipoParticipacionRepository {
	private readonly CACHE_KEY = 'tipos_participacion:all';
	private readonly CACHE_TTL = 600000; // 10 minutos

	async findAll(): Promise<TipoParticipacion[]> {
		// Intentar obtener del caché
		const cached = cache.get<TipoParticipacion[]>(this.CACHE_KEY);
		if (cached) return cached;

		// Si no está en caché, consultar DB
		const tipos = await prisma.tipoParticipacion.findMany();
		const result = tipos.map((t) => TipoParticipacionMapper.toDomain(t));

		// Guardar en caché
		cache.set(this.CACHE_KEY, result, this.CACHE_TTL);
		return result;
	}

	async findById(id: number): Promise<TipoParticipacion | null> {
		const tipo = await prisma.tipoParticipacion.findUnique({
			where: { id_tipo_participacion: id }
		});
		return tipo ? TipoParticipacionMapper.toDomain(tipo) : null;
	}
}
