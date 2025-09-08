export const TIPO_UBICACION = ['principal', 'alternativa', 'virtual'] as const;

export type TipoUbicacion = (typeof TIPO_UBICACION)[number];

export interface Ubicacion {
  id_ubicacion: number;
  tipo_ubicacion: TipoUbicacion;
  que_se_hace: string;
  direccion_id: number; // FK hacia Direccion
  
  // Relación opcional para lectura
  direccion?: import('./Direccion').Direccion;
} 

