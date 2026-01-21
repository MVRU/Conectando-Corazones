import type { UbicacionDisyuncion, TipoUbicacion } from '$lib/domain/types/Ubicacion';
import type { Proyecto } from '$lib/domain/types/Proyecto';
export const PRIORIDAD_TIPO: TipoUbicacion[] = [
	'principal',
	'alternativa',
	'voluntariado',
	'reuniones'
];
export interface ProyectoUbicacion {
	id_proyecto_ubicacion?: number;
	proyecto_id: number;
	ubicacion_id: number;

	// Relaciones opcionales para lectura
	proyecto?: Proyecto;
	ubicacion?: UbicacionDisyuncion;
}
