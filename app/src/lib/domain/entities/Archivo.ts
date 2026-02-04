export class Archivo {
	id_archivo?: number;
	nombre_original?: string | null;
	url?: string;
	descripcion?: string | null;
	tipo_mime?: string | null;
	tamanio_bytes?: number | null;
	created_at?: Date;
	usuario_id?: number | null;
	evidencia_id?: number | null;
	proyecto_id?: number | null;

	constructor(data: Partial<Archivo>) {
		Object.assign(this, data);
	}
}
