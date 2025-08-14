export interface Reporte {
  id_reporte?: number;
  tipo_objeto: 'Usuario' | 'Proyecto' | string;
  id_objeto: number;
  motivo: string;
  descripcion: string;
  created_at?: Date;
  estado?: 'pendiente' | 'resuelto' | 'rechazado';
  fecha_resolucion?: Date | null;
  comentario_resolucion?: string | null;
}