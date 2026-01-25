// Mapper: Prisma Provincia → Domain Provincia
import { Provincia } from '$lib/domain/entities/Provincia';
import type { Provincia as PrismaProvincia } from '@prisma/client';

export function mapProvinciaToDomain(prismaData: PrismaProvincia): Provincia {
    return new Provincia({
        id_provincia: prismaData.id_provincia,
        nombre: prismaData.nombre,
        nombre_corto: prismaData.nombre_corto ?? undefined,
        codigo_iso: prismaData.codigo_iso ?? undefined
    });
}
