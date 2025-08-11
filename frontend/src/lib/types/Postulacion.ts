export type TipoColaborador = 'persona' | 'organizacion';
export type EstadoPostulacion = 'pendiente' | 'aceptada' | 'rechazada';

export interface Postulacion {
	id: number;
	nombre: string;
	tipo: TipoColaborador;
	fecha: string; // ISO date string
	estado: EstadoPostulacion;
	email?: string;
	telefono?: string;
	mensaje?: string;
}

export interface ColaboradorActivo {
	id: number;
	nombre: string;
	tipo: TipoColaborador;
	fechaAceptacion: string; // ISO date string
	email?: string;
	telefono?: string;
}

export interface ProyectoConPostulaciones {
	id: number;
	titulo: string;
	descripcion?: string;
	postulaciones: Postulacion[];
	colaboradoresActivos: ColaboradorActivo[];
	fechaCreacion?: string;
	estado?: 'activo' | 'finalizado' | 'pausado';
}
