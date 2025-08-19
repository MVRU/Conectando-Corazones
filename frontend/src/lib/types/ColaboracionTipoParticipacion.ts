import type { Colaboracion } from './Colaboracion';
import type { ParticipacionPermitida } from './ParticipacionPermitida';

export interface ColaboracionTipoParticipacion {
  id_colaboracion_tipo_participacion?: number; // * PK de la BD
  colaboracion_id?: number;
  participacion_permitida_id?: number;
  cantidad: number;

  // * Objetos expandidos para read
  colaboracion?: Colaboracion;
  participacion_permitida?: ParticipacionPermitida;
}