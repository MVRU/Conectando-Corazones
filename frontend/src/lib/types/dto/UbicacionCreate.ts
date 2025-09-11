import type { TipoUbicacion } from '$lib/types/Ubicacion';
import type { Direccion } from '$lib/types/Direccion';

export interface UbicacionCreate {
  tipo_ubicacion: TipoUbicacion;
  que_se_hace: string;
  direccion: Direccion;
}
