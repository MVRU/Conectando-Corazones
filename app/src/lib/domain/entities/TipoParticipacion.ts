import type {
	TipoParticipacion as ITipoParticipacion,
	TipoParticipacionDescripcion
} from '../types/TipoParticipacion';
import { esTipoParticipacionCanonico } from '../types/TipoParticipacion';

export class TipoParticipacion implements ITipoParticipacion {
	id_tipo_participacion?: number;
	descripcion: TipoParticipacionDescripcion;

	constructor(data: ITipoParticipacion) {
		if (!esTipoParticipacionCanonico(data.descripcion)) {
			throw new Error(`Tipo de participación inválido: ${data.descripcion}`);
		}
		this.id_tipo_participacion = data.id_tipo_participacion;
		this.descripcion = data.descripcion;
	}
}
