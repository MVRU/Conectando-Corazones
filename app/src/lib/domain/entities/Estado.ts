import type { EstadoDescripcion, Estado as IEstado } from '../types/Estado';
import { ESTADOS, ESTADO_LABELS } from '../types/Estado';

export class Estado implements IEstado {
	id_estado?: number;
	descripcion: EstadoDescripcion;

	constructor(data: IEstado) {
		if (!data) {
			throw new Error('Los datos del estado son obligatorios');
		}

		if (
			data.id_estado !== undefined &&
			(typeof data.id_estado !== 'number' || data.id_estado <= 0)
		) {
			throw new Error('El ID de estado debe ser un número positivo válido');
		}

		if (!this.esDescripcionValida(data.descripcion)) {
			throw new Error(`La descripción de estado proporcionada no es válida: ${data.descripcion}`);
		}

		this.id_estado = data.id_estado;
		this.descripcion = data.descripcion;
	}

	private esDescripcionValida(descripcion: string): boolean {
		return ESTADOS.includes(descripcion as EstadoDescripcion);
	}

	esEnCurso(): boolean {
		return this.descripcion === 'en_curso';
	}

	esEnRevision(): boolean {
		return this.descripcion === 'en_revision';
	}

	esEnAuditoria(): boolean {
		return this.descripcion === 'en_auditoria';
	}

	esTerminal(): boolean {
		return ['completado', 'cancelado'].includes(this.descripcion);
	}

	get label(): string {
		return ESTADO_LABELS[this.descripcion];
	}
}
