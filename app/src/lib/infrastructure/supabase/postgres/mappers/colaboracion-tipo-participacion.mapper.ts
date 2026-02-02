import type { ColaboracionTipoParticipacion as PrismaColaboracionTipoParticipacion } from '@prisma/client';
import { ColaboracionTipoParticipacion } from '$lib/domain/entities/ColaboracionTipoParticipacion';

export class ColaboracionTipoParticipacionMapper {
    static toDomain(prisma: PrismaColaboracionTipoParticipacion): ColaboracionTipoParticipacion {
        return new ColaboracionTipoParticipacion({
            id_colaboracion_tipo_participacion: prisma.id_colaboracion_tipo_participacion,
            colaboracion_id: prisma.colaboracion_id ?? undefined,
            participacion_permitida_id: prisma.participacion_permitida_id ?? undefined,
            cantidad: prisma.cantidad
        });
    }

    static toPrisma(domain: ColaboracionTipoParticipacion) {
        return {
            colaboracion_id: domain.colaboracion_id ?? null,
            participacion_permitida_id: domain.participacion_permitida_id ?? null,
            cantidad: domain.cantidad
        };
    }
}
