export interface Consentimiento {
  id_consentimiento: number;
  tipo: 'terminos de uso' | 'privacidad' | 'cookies' | 'otros';
  version: string;
  created_at: Date;
}
