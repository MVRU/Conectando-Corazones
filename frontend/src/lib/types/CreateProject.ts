export type CategoriaProyecto = 
	| 'educacion'
	| 'salud'
	| 'medioambiente'
	| 'promocion-paz'
	| 'seguridad'
	| 'entretenimiento'
	| 'liderazgo'
	| 'personas-discapacidades'
	| 'tecnologia'
	| 'politica'
	| 'religion'
	| 'lgbtq'
	| 'apoyo-crisis'
	| 'empleo'
	| 'inmigrantes-refugiados'
	| 'otro';

export type TipoParticipacion = 'voluntariado' | 'dinero' | 'bienes';

export interface Bien {
	id: string;
	nombre: string;
	cantidad: number;
	unidad: string;
}

export interface CreateProjectForm {
	titulo: string;
	descripcion: string;
	url_portada?: string;
	categorias: CategoriaProyecto[];
	categoriaOtro?: string;
	tipoParticipacion: TipoParticipacion[];
	fecha_fin_tentativa: string;
	id_provincia: number;
	codigo_postal: string;
	cantidadVoluntarios?: number;
	montoDinero?: number;
	bienes: Bien[];
}

export interface CreateProjectErrors {
	titulo?: string;
	descripcion?: string;
	url_portada?: string;
	categorias?: string;
	categoriaOtro?: string;
	tipoParticipacion?: string;
	fecha_fin_tentativa?: string;
	id_provincia?: string;
	codigo_postal?: string;
	cantidadVoluntarios?: string;
	montoDinero?: string;
	bienes?: string;
	general?: string;
}
