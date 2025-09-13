import type { Proyecto } from './Proyecto';
import type { TipoParticipacion } from './TipoParticipacion';

export interface ParticipacionPermitida {
	id_participacion_permitida: number; // * PK de la BD
	id_proyecto?: number;
	id_tipo_participacion?: number;
	objetivo: number;
	actual?: number;
	unidad_medida?: string;
	especie?: string;

	// * Relaciones, opcionales para lectura
	proyecto?: Proyecto;
	tipo_participacion?: TipoParticipacion;
}
