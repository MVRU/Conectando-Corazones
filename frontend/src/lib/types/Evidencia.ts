import type { Archivo } from './Archivo';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';

export interface Evidencia {
  id_evidencia?: number;
  descripcion: string;
  created_at?: Date;
  archivos?: Archivo[];
  solicitudes_finalizacion?: SolicitudFinalizacion[];
  id_proyecto?: number;
}