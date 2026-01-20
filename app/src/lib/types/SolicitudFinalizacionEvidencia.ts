export interface SolicitudFinalizacionEvidencia {
	id_solicitud_finalizacion_evidencia?: number;
	evidencia_id: number; // ! UNIQUE
	solicitud_finalizacion_id: number; // ! UNIQUE
}
