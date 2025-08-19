export interface Verificacion {
  id_verificacion: string;
  tipo: string;
  estado: string;
  created_at?: Date;
  fecha_vencimiento?: Date;
  // * Relaciones (FKs)
  id_usuario?: number;
}
