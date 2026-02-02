import type { Estado as PrismaEstado } from '@prisma/client';
import { Estado } from '$lib/domain/entities/Estado';
import type { EstadoDescripcion } from '$lib/domain/types/Estado';

export class EstadoMapper {
	static toDomain(prismaEstado: PrismaEstado): Estado {
		return new Estado({
			id_estado: prismaEstado.id_estado,
			descripcion: prismaEstado.descripcion as EstadoDescripcion
		});
	}
}
