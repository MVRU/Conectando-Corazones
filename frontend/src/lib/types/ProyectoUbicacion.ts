export interface ProyectoUbicacion {
	id_proyecto_ubicacion?: number;
	proyecto_id: number;
	ubicacion_id: number;
	
	// Relaciones opcionales para lectura
	proyecto?: import('./Proyecto').Proyecto;
	ubicacion?: import('./Ubicacion').Ubicacion;
}
