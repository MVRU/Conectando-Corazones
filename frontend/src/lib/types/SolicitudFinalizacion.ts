
import { Evidencia } from './Evidencia';
export interface SolicitudFinalizacion {
  id_solicitud: string;
  descripcion: string;
  created_at: Date;
  evidencias: Evidencia[];
}
