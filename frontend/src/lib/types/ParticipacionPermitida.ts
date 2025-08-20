import type { Proyecto } from './Proyecto';
import type { TipoParticipacion } from './TipoParticipacion';

export interface ParticipacionPermitida {
  id_participacion_permitida: number; // * PK de la BD
  id_proyecto?: number;
  id_tipo_participacion?: number;
  unidad?: string;
  objetivo: number;
  actual?: number;

  // * Relaciones, opcionales para lectura
  proyecto?: Proyecto;
  tipo_participacion?: TipoParticipacion;
}