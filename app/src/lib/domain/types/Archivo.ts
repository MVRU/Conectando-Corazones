export interface Archivo {
	id_archivo?: number;
	url: string;
	descripcion?: string;
	tipo_mime?: string;
	tamaño?: number; // Tamaño en bytes (opcional)
	created_at?: Date;
	fecha_vencimiento?: Date;

	// * Relaciones (FKs)
	usuario_id?: number;
	evidencia_id?: number;
	proyecto_id?: number;
}
