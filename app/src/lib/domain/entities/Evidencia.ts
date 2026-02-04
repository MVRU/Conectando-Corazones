import { Archivo } from './Archivo';

export class Evidencia {
	id_evidencia?: number;
	tipo_evidencia!: string;
	created_at?: Date;
	id_participacion_permitida!: number;
	archivos?: Archivo[];

	constructor(data: Partial<Evidencia>) {
		Object.assign(this, data);
	}
}
