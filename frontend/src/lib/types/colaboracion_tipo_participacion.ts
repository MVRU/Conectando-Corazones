import type { Colaboracion } from './colaboracion';
import type { TipoParticipacion } from './tipoParticipacion';
import type { Proyecto } from './Proyecto';

export interface ColaboracionTipoParticipacion {
  colaboracion: Colaboracion;
  tipoParticipacion: TipoParticipacion;
  proyecto: Proyecto;
  cantidad: number;
}
