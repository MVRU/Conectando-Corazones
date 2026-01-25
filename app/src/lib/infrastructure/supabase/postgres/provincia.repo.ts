// Repositorio de Provincias - Implementación con Prisma
import type { ProvinciaRepository } from '$lib/domain/repositories/ProvinciaRepository';
import type { Provincia } from '$lib/domain/entities/Provincia';
import { prisma } from '$lib/infrastructure/prisma/client';
import { mapProvinciaToDomain } from './mappers/provincia.mapper';

export class ProvinciaRepoPrisma implements ProvinciaRepository {
    async findAll(): Promise<Provincia[]> {
        const data = await prisma.provincia.findMany({
            orderBy: { nombre: 'asc' }
        });
        return data.map(mapProvinciaToDomain);
    }

    async findById(id: number): Promise<Provincia | null> {
        const data = await prisma.provincia.findUnique({
            where: { id_provincia: id }
        });
        return data ? mapProvinciaToDomain(data) : null;
    }
}
