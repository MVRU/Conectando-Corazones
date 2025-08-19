import type { Localidad } from './Localidad';

export interface Direccion {
	id_direccion?: number;
	calle: string;
	numero: string;
	piso?: string;
	departamento?: string;
	referencia?: string;
	url_google_maps?: string; // ! Cálculo

	// * Relacion con Localidad
	id_localidad?: number;// FK para crear/actualizar
	localidad?: Localidad; // Objeto expandido al leer
}	