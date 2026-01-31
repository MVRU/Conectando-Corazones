import { Ubicacion } from '$lib/domain/entities/Ubicacion';
import type {
	Ubicacion as PrismaUbicacion,
	Localidad as PrismaLocalidad,
	Provincia as PrismaProvincia
} from '@prisma/client';
import { mapLocalidadToDomain } from './localidad.mapper';

export type PrismaUbicacionWithLocalidad = PrismaUbicacion & {
	localidad?: (PrismaLocalidad & { provincia?: PrismaProvincia | null }) | null;
};

export function mapUbicacionToDomain(prismaData: PrismaUbicacionWithLocalidad): Ubicacion {
	return new Ubicacion({
		id_ubicacion: prismaData.id_ubicacion,
		tipo_ubicacion: prismaData.tipo_ubicacion,
		modalidad: prismaData.modalidad as 'presencial' | 'virtual',
		calle: prismaData.calle ?? undefined,
		numero: prismaData.numero ?? undefined,
		piso: prismaData.piso ?? undefined,
		departamento: prismaData.departamento ?? undefined,
		referencia: prismaData.referencia ?? undefined,
		url_google_maps: prismaData.url_google_maps ?? undefined,
		localidad_id: prismaData.localidad_id ?? undefined,
		localidad: prismaData.localidad ? mapLocalidadToDomain(prismaData.localidad) : undefined,
		url_virtual: prismaData.url_virtual ?? undefined
	});
}
