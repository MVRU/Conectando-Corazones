export interface Archivo {
	id_archivo?: number;
	nombre_original?: string;
	url: string;
	descripcion?: string; // descripción representativa brindada por el usuario
	tipo_mime?: string;
	tamanio_bytes?: number; // Tamaño en bytes (opcional)
	created_at?: Date;
	fecha_vencimiento?: Date;

	// * Relaciones (FKs)
	usuario_id?: number;
	evidencia_id?: number;
	proyecto_id?: number;
}
