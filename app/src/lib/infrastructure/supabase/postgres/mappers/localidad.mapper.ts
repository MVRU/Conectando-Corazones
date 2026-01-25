// Mapper: Prisma Localidad → Domain Localidad
import { Localidad } from '$lib/domain/entities/Localidad';
import type { Localidad as PrismaLocalidad, Provincia as PrismaProvincia } from '@prisma/client';
import { mapProvinciaToDomain } from './provincia.mapper';

type PrismaLocalidadWithProvincia = PrismaLocalidad & {
    provincia?: PrismaProvincia | null;
};

export function mapLocalidadToDomain(prismaData: PrismaLocalidadWithProvincia): Localidad {
    return new Localidad({
        id_localidad: prismaData.id_localidad,
        codigo_postal: prismaData.codigo_postal,
        nombre: prismaData.nombre,
        id_provincia: prismaData.id_provincia!,
        provincia: prismaData.provincia ? mapProvinciaToDomain(prismaData.provincia) : undefined
    });
}
