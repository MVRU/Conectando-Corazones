// * Códigos canónicos
export const ESTADOS = [
  'en_curso',
  'pendiente_solicitud_cierre',
  'en_revision',
  'en_auditoria',
  'completado',
  'cancelado'
] as const;

export type EstadoDescripcion = typeof ESTADOS[number];

// ! Interfaz
export interface Estado {
  id_estado?: number;
  descripcion: EstadoDescripcion;
}

// * Mapa de labels para UI
export const ESTADO_LABELS: Record<EstadoDescripcion, string> = {
  en_curso: 'En curso',
  pendiente_solicitud_cierre: 'Pendiente de solicitud de cierre',
  en_revision: 'En revisión',
  en_auditoria: 'En auditoría',
  completado: 'Completado',
  cancelado: 'Cancelado'
};