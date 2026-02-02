import type { ParticipacionPermitida as IParticipacionPermitida } from '../types/ParticipacionPermitida';
import type { Proyecto as ProyectoType } from '../types/Proyecto';
import { Proyecto } from './Proyecto';
import { TipoParticipacion } from './TipoParticipacion';

export class ParticipacionPermitida implements IParticipacionPermitida {
	id_participacion_permitida?: number;
	id_proyecto?: number;
	id_tipo_participacion?: number;
	objetivo: number;
	actual?: number;
	unidad_medida?: string;
	especie?: string;

	// Relaciones (opcionales)
	proyecto?: Proyecto;
	tipo_participacion?: TipoParticipacion;

	constructor(data: IParticipacionPermitida) {
		this.id_participacion_permitida = data.id_participacion_permitida;
		this.id_proyecto = data.id_proyecto;
		this.id_tipo_participacion = data.id_tipo_participacion;
		this.objetivo = data.objetivo;
		this.actual = data.actual || 0;
		this.unidad_medida = data.unidad_medida;
		this.especie = data.especie;
		this.proyecto = data.proyecto ? new Proyecto(data.proyecto) : undefined;
		this.tipo_participacion = data.tipo_participacion
			? new TipoParticipacion(data.tipo_participacion)
			: undefined;

		this.validar();
	}

	private validar(): void {
		if (this.objetivo <= 0) {
			throw new Error('El objetivo debe ser mayor a cero.');
		}
		if (this.actual && this.actual < 0) {
			throw new Error('La cantidad actual no puede ser negativa.');
		}
		if (this.id_tipo_participacion && this.id_tipo_participacion <= 0) {
			throw new Error('El ID de tipo de participación no es válido.');
		}
	}

	estaCompleto(): boolean {
		return (this.actual || 0) >= this.objetivo;
	}

	progreso(): number {
		if (this.objetivo === 0) return 0; // Evitar división por cero
		return Math.min(((this.actual || 0) / this.objetivo) * 100, 100);
	}
}
