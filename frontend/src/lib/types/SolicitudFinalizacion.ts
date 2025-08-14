
import type { Evidencia } from './Evidencia';
export interface SolicitudFinalizacion {
  id_solicitud?: string;
  descripcion: string;
  created_at?: Date;

  // * RELACIONES
  evidencia_ids?: number[]; // -*- FK para create/update
  evidencias?: Evidencia[]; // -*- Objetos expandidos para read
}