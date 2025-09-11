import type { TipoUbicacion } from '$lib/types/Ubicacion';
import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
import type { Direccion } from '$lib/types/Direccion';

// Tipos específicos del formulario de creación de proyecto

export interface UbicacionFormulario {
  tipo_ubicacion: TipoUbicacion | '';
  que_se_hace: string;
  direccion: DireccionFormulario;
}

export interface DireccionFormulario {
  calle: string;
  numero: string;
  referencia: string;
  localidad_id: number | undefined;
  provincia: string;
  localidad_nombre: string;
}

export type ParticipacionForm = Partial<ParticipacionPermitida> & {
  unidad_medida_otra?: string;
};

