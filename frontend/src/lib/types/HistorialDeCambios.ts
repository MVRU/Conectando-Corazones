export interface HistorialDeCambios {
  id_cambio: number;
  tipo_objeto: string;
  id_objeto: number;
  accion: string;
  atributo_afectado: string;
  valor_anterior: string;
  valor_nuevo: string;
  justificacion: string;
  created_at: Date;
}
