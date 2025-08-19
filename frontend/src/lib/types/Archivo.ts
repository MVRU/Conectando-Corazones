export interface Archivo {
  id_archivo?: number;
  url: string;
  descripcion?: string;
  tipo_mime?: string;
  created_at?: Date;

  // * Relaciones (FKs)
  id_usuario?: number;
  id_evidencia?: number;
}