export interface Colaboracion {
  id_colaboracion?: number;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'anulada';
  justificacion?: string;
  created_at?: Date;

  // * Relaciones
  proyecto_id?: number;
  colaborador_id?: number;
}