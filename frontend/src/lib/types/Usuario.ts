import type { Reporte } from './Reporte';
import type { Consentimiento } from './Consentimiento';
import type { Resena } from './Resena';
import type { Categoria } from './Categoria';
import type { TipoParticipacion } from './TipoParticipacion';
import type { Direccion } from './Direccion';
import type { Contacto } from './Contacto';

export interface Usuario {
  id_usuario?: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  estado: string;
  created_at: Date;
  rol: 'institucion' | 'colaborador' | 'administrador';
  url_foto: string;

  categorias_preferidas?: Categoria[];
  tipos_participacion_preferidas?: TipoParticipacion[];
  direccion?: Direccion;
  id_direccion?: number;
}
export interface Institucion extends Usuario {
  nombre_legal: string;
  tipo_institucion: string;
}

export interface Administrador extends Usuario {
}


export interface Colaborador extends Usuario {
  tipo_colaborador: string;
}

export interface Organizacion extends Colaborador {
  razon_social: string;
  con_fines_de_lucro: boolean;
}

export interface Unipersonal extends Colaborador { }

export type ColaboradorDisyuncion = Organizacion | Unipersonal;
