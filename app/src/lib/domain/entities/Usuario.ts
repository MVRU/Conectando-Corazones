// TODO: está incompleto, es solo a modo de prueba, hay que cambiar las importaciones también

import type { Categoria } from '../types/Categoria';
import type { TipoParticipacion } from '../types/TipoParticipacion';
import type { Localidad } from '../types/Localidad';
import type { Contacto } from '../types/Contacto';
import type { Consentimiento } from '../types/Consentimiento';

export class Usuario {
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
	estado_verificacion?: string;
	descripcion?: string;

	// Relaciones
	localidad_id?: number;
	contactos?: Contacto[];
	localidad?: Localidad;
	categorias_preferidas?: Categoria[];
	tipos_participacion_preferidas?: TipoParticipacion[];
	consentimientos?: Consentimiento[];

	// Propiedades específicas de Institucion/Colaborador (flattened)
	nombre_legal?: string;
	tipo_institucion?: string;
	tipo_colaborador?: string;
	razon_social?: string;
	con_fines_de_lucro?: boolean;

	constructor(data: Partial<Usuario>) {
		this.username = data.username || '';
		this.nombre = data.nombre || '';
		this.apellido = data.apellido || '';
		this.rol = data.rol || 'colaborador';
		this.estado = data.estado || 'activo';
		this.url_foto = data.url_foto || '';

		Object.assign(this, data);
	}

	esInstitucion(): boolean {
		return this.rol === 'institucion';
	}

	esAdministrador(): boolean {
		return this.rol === 'administrador';
	}

	nombreCompleto(): string {
		return `${this.nombre} ${this.apellido}`.trim();
	}
}
