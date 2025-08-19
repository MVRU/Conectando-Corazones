export interface Archivo {
  id_archivo?: number;
  url: string;
  descripcion?: string;
  tipo_mime?: string;
  created_at?: Date;
  fecha_vencimiento?: Date;

  // * Relaciones (FKs)
  usuario_id: number; // -*- usuario que sube archivo
}