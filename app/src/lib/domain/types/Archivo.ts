export interface Archivo {
	id_archivo?: number;
	nombre_original?: string; // nombre original del archivo
	url: string;
	descripcion?: string; // descripción representativa brindada por el usuario
	tipo_mime?: string;
	tamanio_bytes?: number; // tamaño en bytes del archivo
	created_at?: Date;
	fecha_vencimiento?: Date;

	// * Relaciones (FKs)
	usuario_id?: number;
	evidencia_id?: number;
	proyecto_id?: number;
}
