import type { Provincia } from './Provincia';

export interface Localidad {
    id_localidad?: number;
    codigo_postal: string;
    nombre: string;

    // * Relación con la provincia
    id_provincia?: number;
    provincia?: Provincia;
}   