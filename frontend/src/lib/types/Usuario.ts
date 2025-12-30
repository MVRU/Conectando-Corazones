import type { Categoria } from './Categoria';
import type { TipoParticipacion } from './TipoParticipacion';
import type { Localidad } from './Localidad'; // Para guardar localidad/ciudad preferida al mostrar proyectos
import type { Contacto } from './Contacto';
import type { Consentimiento } from './Consentimiento';

export interface Usuario {
	id_usuario?: number;
	username: string;
	password?: string;
	nombre: string;
	apellido: string;
	fecha_nacimiento?: Date;
	estado: string;
	created_at?: Date;
	rol: 'institucion' | 'colaborador' | 'administrador';
	url_foto: string;
	estado_verificacion?: string; // ! Cálculo para simplificar

	// * Relaciones
	// -*- FKs para create/update
	localidad_id?: number;

	// -*- Objetos expandidos para read
	contactos?: Contacto[]; // ! sirve para login
	localidad?: Localidad;
	categorias_preferidas?: Categoria[];
	tipos_participacion_preferidas?: TipoParticipacion[];
	consentimientos?: Consentimiento[];
}
export interface Institucion extends Usuario {
	nombre_legal: string;
	tipo_institucion: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Administrador extends Usuario {}

export interface Colaborador extends Usuario {
	tipo_colaborador: string;
}

export interface Organizacion extends Colaborador {
	razon_social: string;
	con_fines_de_lucro: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Unipersonal extends Colaborador {}

export type ColaboradorDisyuncion = Organizacion | Unipersonal;
