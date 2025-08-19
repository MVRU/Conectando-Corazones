export interface Resena {
  id_resena?: number;
  tipo_objeto?: string;
  id_objeto?: number;
  contenido: string;
  puntaje: number;
  aprobado?: boolean;
  username: string;
  rol?: string; // ! No está en DER, agregado como opcional para testimonios de home
    // * Relaciones (FKs)
  id_usuario?: number;
}