import type { TipoUbicacion, ModalidadUbicacion } from '$lib/domain/types/Ubicacion';
import type { ParticipacionPermitida } from '$lib/domain/types/ParticipacionPermitida';

// Tipos específicos del formulario de creación de proyecto

export interface UbicacionFormulario {
	id_proyecto_ubicacion?: number; // Presente si la ubicación existe (modo edición)
	tipo_ubicacion: TipoUbicacion | '';
	modalidad: ModalidadUbicacion | '';
	direccion_presencial?: DireccionPresencialFormulario;
	url_virtual?: string;
}

export interface DireccionPresencialFormulario {
	calle: string;
	numero: string;
	piso?: string;
	departamento?: string;
	referencia?: string;
	url_google_maps?: string;
	localidad_id?: number;
	localidad_nombre?: string;
	provincia?: string;
}

export type ParticipacionForm = Partial<ParticipacionPermitida> & {
	unidad_medida_otra?: string;
};

// deprecado por las dudas
export type DireccionFormulario = DireccionPresencialFormulario;
