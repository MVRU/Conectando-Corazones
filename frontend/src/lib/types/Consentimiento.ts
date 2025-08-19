// * Códigos canónicos
export const TIPOS_CONSENTIMIENTO = [
  'terminos',
  'privacidad',
  'evidencia',
  'conducta',
  'otro'
] as const;

export type TipoConsentimiento = typeof TIPOS_CONSENTIMIENTO[number];

// * Interfaz de Consentimiento
export interface Consentimiento {
  id_consentimiento?: number;
  tipo: TipoConsentimiento;
  version: string;
  created_at?: Date;

  // * Relaciones (FKs)
  id_usuario?: number;
}

// * Guards canónicos
export const esTipoConsentimientoCanonico = (v: string): v is TipoConsentimiento =>
  (TIPOS_CONSENTIMIENTO as readonly string[]).includes(v);