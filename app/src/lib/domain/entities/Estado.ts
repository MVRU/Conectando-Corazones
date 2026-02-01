import type { EstadoDescripcion, Estado as IEstado } from '../types/Estado';
import { ESTADOS, ESTADO_LABELS } from '../types/Estado';

export class Estado implements IEstado {
	id_estado?: number;
	descripcion: EstadoDescripcion;

	constructor(data: IEstado) {
		if (!this.esDescripcionValida(data.descripcion)) {
			throw new Error(`Descripción de estado inválida: ${data.descripcion}`);
		}
		this.id_estado = data.id_estado;
		this.descripcion = data.descripcion;
	}

	private esDescripcionValida(descripcion: string): boolean {
		return ESTADOS.includes(descripcion as EstadoDescripcion);
	}

	esTerminal(): boolean {
		return ['completado', 'cancelado'].includes(this.descripcion);
	}

	get label(): string {
		return ESTADO_LABELS[this.descripcion];
	}
}
