import type { Reporte } from './Reporte';
import type { Consentimiento } from './Consentimiento';
import type { Resena } from './Resena';
import type { Categoria } from './Categoria';
import type { TipoParticipacion } from './TipoParticipacion';
import type { Direccion } from './Direccion';
import type { Contacto } from './Contacto';

export interface Usuario {
  id_usuario?: number; // ! id SIEMPRE -> en el DER no se colocó pq no se contempla la implementación real en la BD, es una representación, un modelado
  username: string;
  email?: string; // ! VER -> opcional para no romper mocks, dsp cambiamos
  password: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: Date;
  estado: string;
  created_at: Date;
  rol: 'institucion' | 'colaborador' | 'administrador';
  url_foto: string;
  reportes?: Reporte[];
  consentimientos?: Consentimiento[];
  resenas?: Resena[];
  categorias_preferidas?: Categoria[];
  tipos_participacion_preferidas?: TipoParticipacion[];
  direccion?: Direccion;
  contacto?: Contacto[];
}

export interface Institucion extends Usuario {
  cuit: string;
  nombre_legal: string;
  tipo_institucion: string;
}

export interface Administrador extends Usuario {
  // reporte_admin: Reporte[]; // ! Esto va del lado del reporte, no del admin (cardinalidad 1:N) -> admin puede tener muchísimos reportes (payloads gigantes y costosos)
}


export interface Colaborador extends Usuario {
  cuit_cuil: string;
  tipo_colaborador: string;
}

export interface Organizacion extends Colaborador {
  razon_social: string;
  con_fines_de_lucro: boolean;
}

export interface Unipersonal extends Colaborador { }

export type ColaboradorDisyuncion = Organizacion | Unipersonal;
