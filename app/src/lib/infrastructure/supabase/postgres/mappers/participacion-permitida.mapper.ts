import type { ParticipacionPermitida as PrismaParticipacionPermitida } from '@prisma/client';
import { ParticipacionPermitida } from '$lib/domain/entities/ParticipacionPermitida';
import { TipoParticipacionMapper } from './tipo-participacion.mapper';

export class ParticipacionPermitidaMapper {
	static toDomain(
		prismaParticipacion: PrismaParticipacionPermitida & {
			tipo_participacion?: any; // Tipado laxo para relaciones incluidas
		}
	): ParticipacionPermitida {
		return new ParticipacionPermitida({
			id_participacion_permitida: prismaParticipacion.id_participacion_permitida,
			id_proyecto: prismaParticipacion.id_proyecto ?? undefined,
			id_tipo_participacion: prismaParticipacion.id_tipo_participacion ?? undefined,
			objetivo: prismaParticipacion.objetivo, // Prisma Int -> number
			actual: prismaParticipacion.actual ?? 0,
			unidad_medida: prismaParticipacion.unidad_medida ?? undefined,
			especie: prismaParticipacion.especie ?? undefined,
			tipo_participacion: prismaParticipacion.tipo_participacion
				? TipoParticipacionMapper.toDomain(prismaParticipacion.tipo_participacion)
				: undefined
		});
	}
}
