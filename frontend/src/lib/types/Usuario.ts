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
  estado_verificacion?: string; // ! Cálculo para simplificar

  // * Relaciones
  // -*- FKs para create/update
  direccion_id?: number;

  // -*- Objetos expandidos para read
  contactos?: Contacto[]; // ! sirve para login
  direccion?: Direccion;
  categorias_preferidas?: Categoria[];
  tipos_participacion_preferidas?: TipoParticipacion[];
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
