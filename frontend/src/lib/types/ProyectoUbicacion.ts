import type { UbicacionDisyuncion } from '$lib/types/Ubicacion';
import type { Proyecto } from '$lib/types/Proyecto';
export interface ProyectoUbicacion {
	id_proyecto_ubicacion?: number;
	proyecto_id: number;
	ubicacion_id: number;
	
	// Relaciones opcionales para lectura
	proyecto?: Proyecto;
	ubicacion?: UbicacionDisyuncion;
}
