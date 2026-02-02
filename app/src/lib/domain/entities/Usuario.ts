import type { Verificacion } from '../types/Verificacion';
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
	verificaciones?: Verificacion[];

	// Propiedades específicas de Institucion/Colaborador (flattened)
	nombre_legal: string;
	tipo_institucion: string;
	tipo_colaborador: string;
	razon_social: string;
	con_fines_de_lucro: boolean;

	constructor(data: Partial<Usuario>) {
		this.id_usuario = data.id_usuario;
		this.username = data.username || '';
		this.nombre = data.nombre || '';
		this.apellido = data.apellido || '';
		this.rol = data.rol || 'colaborador';
		this.estado = data.estado || 'activo';
		this.url_foto = data.url_foto || '';
		this.fecha_nacimiento = data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : undefined;
		this.created_at = data.created_at ? new Date(data.created_at) : undefined;
		this.estado_verificacion = data.estado_verificacion || undefined;
		this.descripcion = data.descripcion || undefined;
		this.password = data.password || undefined;

		// Relaciones FK
		this.localidad_id = data.localidad_id || undefined;

		// Inicializar propiedades específicas para satisfacer interfaces
		this.nombre_legal = data.nombre_legal || '';
		this.tipo_institucion = data.tipo_institucion || '';
		this.tipo_colaborador = data.tipo_colaborador || '';
		this.razon_social = data.razon_social || '';
		this.con_fines_de_lucro = data.con_fines_de_lucro || false;

		// Asignar objetos complejos si existen
		if (data.localidad) this.localidad = data.localidad;
		if (data.contactos) this.contactos = data.contactos;
		if (data.categorias_preferidas) this.categorias_preferidas = data.categorias_preferidas;
		if (data.tipos_participacion_preferidas)
			this.tipos_participacion_preferidas = data.tipos_participacion_preferidas;
		if (data.consentimientos) this.consentimientos = data.consentimientos;
		if (data.verificaciones) this.verificaciones = data.verificaciones;
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

	// Helpers para visualización
	get ubicacionFormateada(): string {
		if (this.localidad) {
			const prov = this.localidad.provincia?.nombre ? `, ${this.localidad.provincia.nombre}` : '';
			return `${this.localidad.nombre}${prov}`;
		}
		return 'Ubicación no disponible';
	}
}
