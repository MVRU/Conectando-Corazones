import type { ColaboracionTipoParticipacionRepository } from '$lib/domain/repositories/ColaboracionTipoParticipacionRepository';
import { ColaboracionTipoParticipacion } from '$lib/domain/entities/ColaboracionTipoParticipacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ColaboracionTipoParticipacionMapper } from './mappers/colaboracion-tipo-participacion.mapper';

export class PostgresColaboracionTipoParticipacionRepository
    implements ColaboracionTipoParticipacionRepository {
    private includeOptions = {
        colaboracion: true,
        participacion_permitida: { include: { tipo_participacion: true } }
    };

    async create(aporte: ColaboracionTipoParticipacion): Promise<ColaboracionTipoParticipacion> {
        const data = ColaboracionTipoParticipacionMapper.toPrisma(aporte);
        const created = await prisma.colaboracionTipoParticipacion.create({
            data,
            include: this.includeOptions
        });
        return ColaboracionTipoParticipacionMapper.toDomain(created);
    }

    // Crea aporte + actualiza métricas + registra auditoría (atómico)
    async createConActualizacionMetricas(
        aporte: ColaboracionTipoParticipacion,
        participacionPermitidaId: number,
        cantidadAAgregar: number,
        usuarioId: number
    ): Promise<ColaboracionTipoParticipacion> {
        const data = ColaboracionTipoParticipacionMapper.toPrisma(aporte);

        const result = await prisma.$transaction(async (tx) => {
            // 1. Crear el aporte
            const created = await tx.colaboracionTipoParticipacion.create({
                data,
                include: this.includeOptions
            });

            // 2. Actualizar métricas (incrementar 'actual')
            await tx.participacionPermitida.update({
                where: { id_participacion_permitida: participacionPermitidaId },
                data: { actual: { increment: cantidadAAgregar } }
            });

            // 3. Registrar en log de auditoría
            await tx.historialDeCambios.create({
                data: {
                    tipo_objeto: 'colaboracion_tipo_participacion',
                    id_objeto: created.id_colaboracion_tipo_participacion,
                    accion: 'crear',
                    atributo_afectado: 'cantidad',
                    valor_anterior: '0',
                    valor_nuevo: String(cantidadAAgregar),
                    usuario_id: usuarioId
                }
            });

            return created;
        });

        return ColaboracionTipoParticipacionMapper.toDomain(result);
    }

    async findById(id: number): Promise<ColaboracionTipoParticipacion | null> {
        const aporte = await prisma.colaboracionTipoParticipacion.findUnique({
            where: { id_colaboracion_tipo_participacion: id },
            include: this.includeOptions
        });
        return aporte ? ColaboracionTipoParticipacionMapper.toDomain(aporte) : null;
    }

    async findByParticipacionPermitida(
        participacionPermitidaId: number
    ): Promise<ColaboracionTipoParticipacion[]> {
        const aportes = await prisma.colaboracionTipoParticipacion.findMany({
            where: { participacion_permitida_id: participacionPermitidaId },
            include: this.includeOptions
        });
        return aportes.map((a) => ColaboracionTipoParticipacionMapper.toDomain(a));
    }
}
