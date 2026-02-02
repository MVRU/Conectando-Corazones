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
			objetivo: prismaParticipacion.objetivo,
			actual: prismaParticipacion.actual ?? 0,
			unidad_medida: prismaParticipacion.unidad_medida ?? undefined,
			especie: prismaParticipacion.especie ?? undefined,
			tipo_participacion: prismaParticipacion.tipo_participacion
				? TipoParticipacionMapper.toDomain(prismaParticipacion.tipo_participacion)
				: undefined
		});
	}

	static toPrisma(domain: ParticipacionPermitida) {
		return {
			id_proyecto: domain.id_proyecto,
			id_tipo_participacion: domain.id_tipo_participacion,
			objetivo: domain.objetivo,
			actual: domain.actual || 0,
			unidad_medida: domain.unidad_medida,
			especie: domain.especie
		};
	}
}
