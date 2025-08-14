import type { SolicitudFinalizacion } from './SolicitudFinalizacion';
import type { ColaboradorDisyuncion } from './Usuarios';

export interface Evaluacion {
  solicitud: SolicitudFinalizacion;
  colaborador: ColaboradorDisyuncion;
  created_at: Date;
  voto: 'aprobado' | 'rechazado';
  justificacion: string;
}
