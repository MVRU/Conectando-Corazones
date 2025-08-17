// * DECISIÓN DE DISEÑO: limitar los estados posibles para evitar inconsistencias
export type EstadoColaboracion = 'pendiente' | 'aceptada' | 'rechazada'; // ! VER: dsp hablamos de esto

export interface Colaboracion {
  id_colaboracion?: number;
  estado: EstadoColaboracion;
  created_at?: Date;
}