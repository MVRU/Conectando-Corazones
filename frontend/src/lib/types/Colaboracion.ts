// * DECISIÓN DE DISEÑO: limitar los estados posibles para evitar inconsistencias
export type EstadoColaboracion = 'pendiente' | 'aprobada' | 'rechazada' | 'anulada';

export interface Colaboracion {
  id_colaboracion?: number;
  estado: EstadoColaboracion;
  justificacion?: string;
  created_at?: Date;
  id_proyecto?: number;
}