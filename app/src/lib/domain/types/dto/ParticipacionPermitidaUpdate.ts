import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';

/**
 * DTO para actualizar una participación permitida existente.
 * El objetivo solo puede aumentar, nunca disminuir.
 */
export interface ParticipacionPermitidaUpdate {
	id_participacion_permitida?: number; // Si existe, es actualización; si no, es nueva
	tipo_participacion: TipoParticipacionDescripcion;
	objetivo: number; // Debe ser > al objetivo actual
	unidad_medida: string;
	especie?: string;
}
