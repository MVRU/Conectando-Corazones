import type { Colaboracion } from '../types/Colaboracion';
import type { Evidencia } from '../types/Evidencia';

export interface ColaboracionRepository {
	getColaboracion(proyectoId: number, usuarioId: number): Promise<Colaboracion | null>;
	getAportesPorColaboracion(colaboracionId: number): Promise<any[]>;
	getEvidencias(participacionPermitidaId: number): Promise<any[]>;
	getColaboracionesPorProyecto(proyectoId: number): Promise<Colaboracion[]>;
}
