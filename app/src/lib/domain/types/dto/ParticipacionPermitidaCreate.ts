import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';

export interface ParticipacionPermitidaCreate {
	tipo_participacion: TipoParticipacionDescripcion;
	objetivo: number;
	unidad_medida?: string;
	especie?: string;
}
