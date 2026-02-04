import { Archivo } from './Archivo';

export class Evidencia {
	id_evidencia?: number;
	tipo_evidencia!: 'entrada' | 'salida';
	created_at?: Date;
	id_participacion_permitida!: number;
	archivos: Archivo[] = [];

	constructor(data: Partial<Evidencia>) {
		Object.assign(this, data);
		// Si se pasan archivos en data, asegurar de que sean instancias de Archivo
		if (data.archivos && Array.isArray(data.archivos)) {
			this.archivos = data.archivos.map((a) => (a instanceof Archivo ? a : new Archivo(a)));
		}
		this.validarInvariantes();
	}

	private validarInvariantes() {
		if (!this.tipo_evidencia || !['entrada', 'salida'].includes(this.tipo_evidencia)) {
			throw new Error('El tipo de evidencia debe ser "entrada" o "salida".');
		}
		if (!this.id_participacion_permitida) {
			throw new Error('La evidencia debe estar asociada a una participación permitida.');
		}
	}

	public agregarArchivo(archivo: Archivo) {
		this.archivos.push(archivo);
	}
}
