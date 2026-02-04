import { Evidencia } from '../entities/Evidencia';

export interface EvidenciaRepository {
	findAllByProyecto(proyectoId: number): Promise<Evidencia[]>;
}
