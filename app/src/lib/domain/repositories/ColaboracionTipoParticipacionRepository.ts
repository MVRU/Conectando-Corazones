import type { ColaboracionTipoParticipacion } from '../entities/ColaboracionTipoParticipacion';

export interface ColaboracionTipoParticipacionRepository {
    create(aporte: ColaboracionTipoParticipacion): Promise<ColaboracionTipoParticipacion>;
    findById(id: number): Promise<ColaboracionTipoParticipacion | null>;
    findByParticipacionPermitida(participacionPermitidaId: number): Promise<ColaboracionTipoParticipacion[]>;

    // Crea aporte + actualiza métricas + registra auditoría
    createConActualizacionMetricas(
        aporte: ColaboracionTipoParticipacion,
        participacionPermitidaId: number,
        cantidadAAgregar: number,
        usuarioId: number
    ): Promise<ColaboracionTipoParticipacion>;
}
