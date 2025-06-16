import type { Province } from './province';

export interface Location {
    id?: number;             // Identificador único de la DB y en casos raros en que el CPA se repita
    name: string;            // Nombre de la ciudad/localidad
    postalCode: string;      // Código postal (CPA)
    province: Province;      // Referencia a Provincia a la que pertenece
}