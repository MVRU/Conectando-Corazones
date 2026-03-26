import type { ParticipacionPermitida as PrismaParticipacionPermitida } from '@prisma/client';
import { ParticipacionPermitida } from '$lib/domain/entities/ParticipacionPermitida';
import { TipoParticipacionMapper } from './tipo-participacion.mapper';

export class ParticipacionPermitidaMapper {
	static toDomain(
		prismaParticipacion: PrismaParticipacionPermitida & {
			tipo_participacion?: any;
			colaboraciones_tipo_participacion?: any[];
		}
	): ParticipacionPermitida {
		const contributions = prismaParticipacion.colaboraciones_tipo_participacion || [];
		const actualCalculado = contributions.reduce((sum, c) => sum + (c.cantidad || 0), 0);

		return new ParticipacionPermitida({
			id_participacion_permitida: prismaParticipacion.id_participacion_permitida,
			id_proyecto: prismaParticipacion.id_proyecto ?? undefined,
			id_tipo_participacion: prismaParticipacion.id_tipo_participacion ?? undefined,
			objetivo: prismaParticipacion.objetivo,
			actual: actualCalculado,
			unidad_medida: prismaParticipacion.unidad_medida ?? undefined,
			especie: prismaParticipacion.especie ?? undefined,
			tipo_participacion: prismaParticipacion.tipo_participacion
				? TipoParticipacionMapper.toDomain(prismaParticipacion.tipo_participacion)
				: undefined,
			colaboraciones_tipo_participacion: contributions.map((c: any) => ({
				id_colaboracion_tipo_participacion: c.id_colaboracion_tipo_participacion,
				colaboracion_id: c.colaboracion_id,
				participacion_permitida_id: c.participacion_permitida_id,
				cantidad: c.cantidad,
				colaboracion: c.colaboracion // Asegurar que pasamos la relacion colaboracion si existe
			}))
		});
	}

	static toPrisma(domain: ParticipacionPermitida) {
		return {
			id_proyecto: domain.id_proyecto,
			id_tipo_participacion: domain.id_tipo_participacion,
			objetivo: domain.objetivo,
			// actual: se calcula dinamicamente
			unidad_medida: domain.unidad_medida,
			especie: domain.especie
		};
	}
}
