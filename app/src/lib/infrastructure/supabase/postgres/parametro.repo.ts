import type { ParametroRepository } from '$lib/domain/repositories/ParametroRepository';
import type { Parametro } from '$lib/domain/entities/Parametro';
import { prisma } from '$lib/infrastructure/prisma/client';
import { mapParametroToDomain } from './mappers/parametro.mapper';

export class ParametroRepoPrisma implements ParametroRepository {
    async findAll(filtro?: string): Promise<Parametro[]> {
        const where = filtro ? {
            OR: [
                { nombre: { contains: filtro, mode: 'insensitive' as const } },
                { descripcion: { contains: filtro, mode: 'insensitive' as const } }
            ]
        } : {};

        const data = await prisma.parametro.findMany({
            where,
            orderBy: { nombre: 'asc' }
        });
        return data.map(mapParametroToDomain);
    }

    async findById(id: number): Promise<Parametro | null> {
        const data = await prisma.parametro.findUnique({ where: { id_parametro: id } });
        return data ? mapParametroToDomain(data) : null;
    }

    async findByNombre(nombre: string): Promise<Parametro | null> {
        const data = await prisma.parametro.findFirst({ where: { nombre } });
        return data ? mapParametroToDomain(data) : null;
    }

    async updateValor(id: number, nuevoValor: string): Promise<Parametro> {
        const data = await prisma.parametro.update({
            where: { id_parametro: id },
            data: { valor: nuevoValor }
        });
        return mapParametroToDomain(data);
    }
}
