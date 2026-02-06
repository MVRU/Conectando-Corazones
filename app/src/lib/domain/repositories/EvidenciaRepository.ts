import { Evidencia } from '../entities/Evidencia';
import type { Archivo } from '../entities/Archivo';

export interface EvidenciaRepository {
	findAllByProyecto(proyectoId: number): Promise<Evidencia[]>;
	findByParticipacionAndTipo(idParticipacion: number, tipo: string): Promise<Evidencia | null>;
	create(evidencia: Evidencia): Promise<Evidencia>;
	addArchivos(idEvidencia: number, archivos: Archivo[]): Promise<Archivo[]>;
}
