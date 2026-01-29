import type { EstadoRepository } from '$lib/domain/repositories/EstadoRepository';
import type { Estado } from '$lib/domain/entities/Estado';
import type { EstadoDescripcion } from '$lib/domain/types/Estado';
import { prisma } from '$lib/infrastructure/prisma/client';
import { EstadoMapper } from './mappers/estado.mapper';

export class PostgresEstadoRepository implements EstadoRepository {
	async findAll(): Promise<Estado[]> {
		const estados = await prisma.estado.findMany();
		return estados.map((e) => EstadoMapper.toDomain(e));
	}

	async findByDescripcion(descripcion: EstadoDescripcion): Promise<Estado | null> {
		const estado = await prisma.estado.findUnique({
			where: { descripcion }
		});
		return estado ? EstadoMapper.toDomain(estado) : null;
	}
}
