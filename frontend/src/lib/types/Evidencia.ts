import type { Archivo } from './Archivo';
import type { SolicitudFinalizacion } from './SolicitudFinalizacion';

export interface Evidencia {
  id_evidencia?: number;
  descripcion: string;
  created_at?: Date;

  // * Relaciones
  // -*- FKs para create/update
  archivos_ids: number[]; // ! tiene que tener al menos un elemento
  evidencias_entradas_ids?: number[]; // ! solo si es una evidencia de salida

  // -*- Objetos expandidos
  archivos?: Archivo[];
  solicitudes_finalizacion?: SolicitudFinalizacion[];
  id_proyecto?: number;
}