import type { SolicitudFinalizacion } from './SolicitudFinalizacion';
import type { ColaboradorDisyuncion } from './Usuario';

export interface Evaluacion {
	id_evaluacion?: number;
	voto: 'aprobado' | 'rechazado' | null;
	created_at?: Date;
	justificacion?: string | null; // motivo por el que rechaza la solicitud de cierre

	// * Relaciones
	// -*- FKs para create/update
	solicitud_id?: number;
	colaborador_id?: number;

	// -*- Objetos expandidos para read
	solicitud?: SolicitudFinalizacion;
	colaborador?: ColaboradorDisyuncion;
}
