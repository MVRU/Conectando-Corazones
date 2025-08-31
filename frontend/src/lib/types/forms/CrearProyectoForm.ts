import type { PrioridadTipo } from '$lib/types/ProyectoUbicacion';
import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';

// Tipos específicos del formulario de creación de proyecto

export interface DireccionFormulario {
  tipo_ubicacion: PrioridadTipo | '';
  que_sehace: string;
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

