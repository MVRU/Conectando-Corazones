import type { UbicacionDisyuncion, TipoUbicacion } from '$lib/types/Ubicacion';
import type { Proyecto } from '$lib/types/Proyecto';
export const PRIORIDAD_TIPO: TipoUbicacion[] = ['principal', 'voluntariado', 'alternativa', 'secundaria'];
export interface ProyectoUbicacion {
	id_proyecto_ubicacion?: number;
	proyecto_id: number;
	ubicacion_id: number;
	
	// Relaciones opcionales para lectura
	proyecto?: Proyecto;
	ubicacion?: UbicacionDisyuncion;
}
