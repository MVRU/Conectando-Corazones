import type { Evaluacion } from '../entities/Evaluacion';

export interface EvaluacionRepository {
    create(evaluacion: Evaluacion): Promise<Evaluacion>;
    findBySolicitudAndColaborador(solicitudId: number, colaboradorId: number): Promise<Evaluacion | null>;
    countVotosBySolicitud(solicitudId: number): Promise<{ aprobados: number; rechazados: number; total: number }>;
}
