import type { Localidad } from './Localidad';

export interface Provincia {
  id_provincia: string;
  nombre: string;
  localidades?: Localidad[]; 
}
