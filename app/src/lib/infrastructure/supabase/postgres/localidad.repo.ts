// Repositorio de Localidades - Implementación con Prisma
import type { LocalidadRepository } from '$lib/domain/repositories/LocalidadRepository';
import type { Localidad } from '$lib/domain/entities/Localidad';
import { prisma } from '$lib/infrastructure/prisma/client';
import { mapLocalidadToDomain } from './mappers/localidad.mapper';

export class LocalidadRepoPrisma implements LocalidadRepository {
    async findAll(): Promise<Localidad[]> {
        const data = await prisma.localidad.findMany({
            include: { provincia: true },
            orderBy: { nombre: 'asc' }
        });
        return data.map(mapLocalidadToDomain);
    }

    async findById(id: number): Promise<Localidad | null> {
        const data = await prisma.localidad.findUnique({
            where: { id_localidad: id },
            include: { provincia: true }
        });
        return data ? mapLocalidadToDomain(data) : null;
    }

    async findByProvinciaId(idProvincia: number): Promise<Localidad[]> {
        const data = await prisma.localidad.findMany({
            where: { id_provincia: idProvincia },
            include: { provincia: true },
            orderBy: { nombre: 'asc' }
        });
        return data.map(mapLocalidadToDomain);
    }

    async findByCodigoPostal(codigoPostal: string): Promise<Localidad | null> {
        const data = await prisma.localidad.findFirst({
            where: { codigo_postal: codigoPostal },
            include: { provincia: true }
        });
        return data ? mapLocalidadToDomain(data) : null;
    }
}
