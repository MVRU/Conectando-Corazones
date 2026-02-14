import { prisma } from '$lib/infrastructure/prisma/client';
import type { EvaluacionRepository } from '$lib/domain/repositories/EvaluacionRepository';
import type { Evaluacion } from '$lib/domain/entities/Evaluacion';
import { EvaluacionMapper } from '$lib/infrastructure/supabase/postgres/mappers/evaluacion.mapper';

export class PostgresEvaluacionRepository implements EvaluacionRepository {
    async create(evaluacion: Evaluacion): Promise<Evaluacion> {
        const data = EvaluacionMapper.toPrisma(evaluacion);
        const created = await prisma.evaluacion.create({
            data: {
                ...data,
            },
            include: { colaborador: true }
        });
        return EvaluacionMapper.toDomain(created as any);
    }

    async findBySolicitudAndColaborador(solicitudId: number, colaboradorId: number): Promise<Evaluacion | null> {
        const found = await prisma.evaluacion.findUnique({
            where: {
                solicitud_id_colaborador_id: {
                    solicitud_id: solicitudId,
                    colaborador_id: colaboradorId
                }
            },
            include: { colaborador: true }
        });
        return found ? EvaluacionMapper.toDomain(found as any) : null;
    }

    async countVotosBySolicitud(solicitudId: number): Promise<{ aprobados: number; rechazados: number; total: number }> {
        const counts = await prisma.evaluacion.groupBy({
            by: ['voto'],
            where: { solicitud_id: solicitudId },
            _count: { voto: true }
        });

        let aprobados = 0;
        let rechazados = 0;

        counts.forEach(c => {
            if (c.voto === 'aprobado') aprobados = c._count.voto;
            if (c.voto === 'rechazado') rechazados = c._count.voto;
        });

        return { aprobados, rechazados, total: aprobados + rechazados };
    }
}
