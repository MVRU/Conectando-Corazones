export interface Archivo {
  id_archivo?: number;
  url: string;
  descripcion?: string;
  tipo_mime?: string;
  created_at?: Date;
  fecha_vencimiento?: Date;

  // * Relaciones (FKs)
  id_usuario?: number;
  id_evidencia?: number;
}