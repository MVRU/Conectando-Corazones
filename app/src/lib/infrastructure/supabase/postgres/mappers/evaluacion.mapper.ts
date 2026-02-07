import type { Evaluacion as PrismaEvaluacion } from '@prisma/client';
import { Evaluacion, type VotoEvaluacion } from '$lib/domain/entities/Evaluacion';
import { UsuarioMapper } from './usuario.mapper';
// import { SolicitudFinalizacionMapper } from './solicitud-finalizacion.mapper'; // TODO: Crear cuando exista

export class EvaluacionMapper {
    static toDomain(
        prismaEvaluacion: PrismaEvaluacion & {
            colaborador?: any;
            solicitud?: any;
        }
    ): Evaluacion {
        if (!prismaEvaluacion.solicitud_id) throw new Error('Evaluación sin solicitud_id');
        if (!prismaEvaluacion.colaborador_id) throw new Error('Evaluación sin colaborador_id');

        return new Evaluacion({
            id_evaluacion: prismaEvaluacion.id_evaluacion,
            voto: prismaEvaluacion.voto as VotoEvaluacion,
            justificacion: prismaEvaluacion.justificacion,
            created_at: prismaEvaluacion.created_at ?? undefined,
            solicitud_id: prismaEvaluacion.solicitud_id,
            colaborador_id: prismaEvaluacion.colaborador_id,
            colaborador: prismaEvaluacion.colaborador
                ? UsuarioMapper.toDomain(prismaEvaluacion.colaborador)
                : undefined,
            solicitud: prismaEvaluacion.solicitud
                ? prismaEvaluacion.solicitud
                : undefined
        });
    }

    static toPrisma(evaluacion: Evaluacion): any {
        return {
            voto: evaluacion.voto,
            justificacion: evaluacion.justificacion,
            solicitud_id: evaluacion.solicitud_id,
            colaborador_id: evaluacion.colaborador_id,
            created_at: evaluacion.created_at ?? new Date()
        };
    }
}
