import type { ColaboracionTipoParticipacion } from '../entities/ColaboracionTipoParticipacion';

export interface ColaboracionTipoParticipacionRepository {
    findById(id: number): Promise<ColaboracionTipoParticipacion | null>;
    findByParticipacionPermitida(participacionPermitidaId: number): Promise<ColaboracionTipoParticipacion[]>;
    findByColaboracionAndParticipacion(
        colaboracionId: number,
        participacionPermitidaId: number
    ): Promise<ColaboracionTipoParticipacion | null>;

    // Crea o actualiza aporte + actualiza métricas + registra auditoría
    upsertConActualizacionMetricas(
        aporte: ColaboracionTipoParticipacion,
        usuarioId: number
    ): Promise<ColaboracionTipoParticipacion>;
}
