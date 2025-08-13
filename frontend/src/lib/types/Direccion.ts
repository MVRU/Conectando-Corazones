import type { Localidad } from './Localidad';

export interface Direccion {
	id_direccion: string;
	calle: string;
	numero: string;
	piso?: string;
	departamento?: string;
	referencia?: string;
	url_google_maps?: string;
	localidad: Localidad;
}
