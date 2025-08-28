export interface Reporte {
  id_reporte?: number;
  tipo_objeto: 'Usuario' | 'Proyecto' | string;
  id_objeto: number;
  motivo: string; // -*- podríamos definir un enum más adelante: ['spam' | 'fraude' | ...]
  descripcion: string;
  created_at?: Date;
  estado?: 'pendiente' | 'resuelto' | 'rechazado';
  fecha_resolucion?: Date | null;
  comentario_resolucion?: string | null;

  // * Relaciones (FKs)
  reportante_id: number; // -*- usuario que reporta
  admin_id?: number | null; // -*- usuario admin que resuelve el reporte
  usuario_id?: number;
}