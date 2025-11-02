import type { Localidad } from './Localidad';

export const TIPO_UBICACION = ['principal','alternativa','secundaria', 'voluntariado'] as const;
export const MODALIDAD_UBICACION = ['presencial', 'virtual'] as const;

export type TipoUbicacionBase = (typeof TIPO_UBICACION)[number];
export type TipoUbicacion = TipoUbicacionBase | string; // Permite valores personalizados
export type ModalidadUbicacion = (typeof MODALIDAD_UBICACION)[number];

export interface Ubicacion {
  id_ubicacion?: number;
  tipo_ubicacion: TipoUbicacion;
  modalidad: ModalidadUbicacion;
}

export interface UbicacionPresencial extends Ubicacion {
  modalidad: 'presencial';
  // Atributos presenciales
  calle: string;
  numero: string;
  piso?: string;
  departamento?: string;
  referencia?: string;
  url_google_maps?: string;
  
  // Relación con Localidad
  localidad_id: number; // FK obligatoria
  localidad?: Localidad; // Objeto expandido para lectura
}

export interface UbicacionVirtual extends Ubicacion {
  modalidad: 'virtual';
  // Atributos virtuales
  url_virtual: string;
}

export type UbicacionDisyuncion = UbicacionPresencial | UbicacionVirtual; 

