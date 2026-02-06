export class Archivo {
	id_archivo?: number;
	nombre_original!: string;
	url!: string;
	descripcion?: string | null;
	tipo_mime?: string | null;
	tamanio_bytes?: number | null;
	created_at?: Date;
	usuario_id?: number | null;
	evidencia_id?: number | null;
	proyecto_id?: number | null;

	constructor(data: Partial<Archivo>) {
		Object.assign(this, data);
		this.validarInvariantes();
	}

	private validarInvariantes() {
		if (!this.url || this.url.trim() === '') {
			throw new Error('La URL del archivo es obligatoria.');
		}
		if (!this.nombre_original || this.nombre_original.trim() === '') {
			throw new Error('El nombre original del archivo es obligatorio.');
		}
	}
}
