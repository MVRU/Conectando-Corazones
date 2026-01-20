import type { ColaboradorDisyuncion } from '$lib/domain/types/Usuario';
export interface Colaboracion {
	id_colaboracion?: number;
	estado: 'pendiente' | 'aprobada' | 'rechazada' | 'anulada';
	justificacion?: string;
	created_at?: Date;
	mensaje?: string;

	// * Relaciones
	// -*- FKs para create/update
	proyecto_id?: number;
	colaborador_id?: number;

	// -*- Objetos expandidos para read
	colaborador?: ColaboradorDisyuncion;
}
