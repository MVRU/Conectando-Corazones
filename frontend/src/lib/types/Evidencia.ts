import type { Archivo } from './Archivo';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';
import type { ParticipacionPermitida } from './ParticipacionPermitida';

export interface Evidencia {
	id_evidencia?: number;
	created_at?: Date;

	// * Relaciones
	// -*- FKs para create/update
	archivos_ids: number[]; // ! tiene que tener al menos un elemento
	evidencias_entradas_ids?: number[]; // ! solo si es una evidencia de salida
	id_participacion_permitida: number; // FK al objetivo que respalda esta evidencia

	// -*- Objetos expandidos
	archivos?: Archivo[];
	solicitudes_finalizacion?: SolicitudFinalizacion[];
	participacion_permitida?: ParticipacionPermitida; // Objetivo asociado a esta evidencia
	id_proyecto?: number;
}
