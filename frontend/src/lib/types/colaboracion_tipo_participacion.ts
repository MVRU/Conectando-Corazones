import type { Colaboracion } from './Colaboracion';
import type { TipoParticipacion } from './TipoParticipacion';
import type { Proyecto } from './Proyecto';

export interface ColaboracionTipoParticipacion {
  colaboracion: Colaboracion;
  tipoParticipacion: TipoParticipacion;
  proyecto: Proyecto;
  cantidad: number;
}