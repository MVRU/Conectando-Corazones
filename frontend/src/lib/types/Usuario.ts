import type { Reporte } from './Reporte';
import type { Consentimiento } from './Consentimiento';
import type { Resena } from './Resena';
import type { Categoria } from './Categoria';
import type { TipoParticipacion } from './TipoParticipacion';
import type { Direccion } from './Direccion';
import type { Contacto } from './Contacto';
import type { HistorialDeCambios } from './HistorialDeCambios';

export interface Usuario {
  username: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_nacimiento: string;
  estado: string;
  created_at: string;
  rol: 'institucion' | 'colaborador' | 'administrador';
  url_foto: string;
  reportes?: Reporte[];
  consentimientos?: Consentimiento[];
  resenas?: Resena[];
  categorias?: Categoria[];
  tipoParticipaciones?: TipoParticipacion[];
  direccion?: Direccion;
  contacto?: Contacto;
  historialDeCambios?: HistorialDeCambios[];
}

export interface Institucion extends Usuario {
  cuit: string;
  nombre_legal: string;
  tipo_institucion: string;
}

export interface Administrador extends Usuario {
  reporte_admin: Reporte[];
}


export interface Colaborador extends Usuario {
  cuit_cuil: string;
  tipo_colaborador: string;
}

export interface Organizacion extends Colaborador {
  razon_social: string;
  con_fines_de_lucro: boolean;
}

export interface Unipersonal extends Colaborador {}

export type ColaboradorDisyuncion = Organizacion | Unipersonal;
