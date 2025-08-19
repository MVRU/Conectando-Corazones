
import type { Evidencia } from './Evidencia';
import type { Proyecto } from './Proyecto';
export interface SolicitudFinalizacion {
  id_solicitud?: number;
  estado?: string; // ! opcional porque es un cálculo, pero es relevante tenerlo
  created_at?: Date;

  // * RELACIONES
  // -*- FKs para create/update
  proyecto_id: number;

  // -*- Objetos expandidos para read
  proyecto?: Proyecto;
  evidencias?: Evidencia[];
}