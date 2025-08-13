import type { Provincia } from './Provincia';

export interface Localidad {
    codigo_postal: string;
    nombre: string;
    provincia?: Provincia; 
}