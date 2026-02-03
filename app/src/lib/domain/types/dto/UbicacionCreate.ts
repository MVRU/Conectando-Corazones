import type { TipoUbicacion, ModalidadUbicacion } from '$lib/domain/types/Ubicacion';

export interface UbicacionPresencialCreate {
	calle: string;
	numero: string;
	piso?: string;
	departamento?: string;
	referencia?: string;
	url_google_maps?: string;
	localidad_id?: number;
}

export interface UbicacionCreate {
	id_proyecto_ubicacion?: number;
	id_ubicacion?: number;
	tipo_ubicacion: TipoUbicacion;
	modalidad: ModalidadUbicacion;
	direccion_presencial?: UbicacionPresencialCreate;
	url_virtual?: string;
}
