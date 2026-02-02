import type {
	TipoParticipacion as ITipoParticipacion,
	TipoParticipacionDescripcion
} from '../types/TipoParticipacion';
import { esTipoParticipacionCanonico, TIPO_PARTICIPACION_LABELS } from '../types/TipoParticipacion';

export class TipoParticipacion implements ITipoParticipacion {
	id_tipo_participacion?: number;
	descripcion: TipoParticipacionDescripcion;

	constructor(data: ITipoParticipacion) {
		if (!data) {
			throw new Error('Los datos del tipo de participación son obligatorios');
		}

		if (
			data.id_tipo_participacion !== undefined &&
			(typeof data.id_tipo_participacion !== 'number' || data.id_tipo_participacion <= 0)
		) {
			throw new Error('El ID de tipo de participación debe ser un número positivo válido');
		}

		if (!esTipoParticipacionCanonico(data.descripcion)) {
			throw new Error(`Tipo de participación inválido: ${data.descripcion}`);
		}

		this.id_tipo_participacion = data.id_tipo_participacion;
		this.descripcion = data.descripcion;
	}

	/**
	 * Indica si el tipo es Voluntariado (tiempo o personas)
	 */
	esVoluntariado(): boolean {
		return this.descripcion === 'Voluntariado';
	}

	/**
	 * Indica si el tipo es Especie (bienes materiales)
	 */
	esEspecie(): boolean {
		return this.descripcion === 'Especie';
	}

	/**
	 * Indica si el tipo es Monetaria (dinero)
	 */
	esMonetaria(): boolean {
		return this.descripcion === 'Monetaria';
	}

	/**
	 * Retorna el label amigable para la interfaz del usuario
	 */
	get label(): string {
		return TIPO_PARTICIPACION_LABELS[this.descripcion];
	}
}
