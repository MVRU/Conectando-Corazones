export type EstadoGestionUsuario = 'activo' | 'pendiente' | 'inhabilitado';

export interface KpisPanelAdminDto {
	totalUsuarios: number;
	usuariosPorRol: Record<string, number>;
	usuariosActivos: number;
	usuariosPendientes: number;
	usuariosInhabilitados: number;
	proyectosEnCurso: number;
	proyectosFinalizados: number;
	proyectosCancelados: number;
	reportesPendientes: number;
	reportesResueltosMes: number;
	onboardingPendiente: number;
}

export interface DocumentoVerificacionDto {
	id_archivo: number;
	nombre_original: string | null;
	url: string;
	tipo_mime: string | null;
	created_at: Date | null;
}

export interface SolicitudOnboardingAdminDto {
	id_verificacion: number;
	usuario_id: number;
	username: string;
	nombre: string;
	apellido: string;
	rol: string;
	tipo: string;
	estado: string;
	created_at: Date | null;
	documentos: DocumentoVerificacionDto[];
}

export interface UsuarioAdminItemDto {
	id_usuario: number;
	username: string;
	nombre: string;
	apellido: string;
	rol: string;
	estado: string;
	estado_verificacion: string | null;
	estado_gestion: EstadoGestionUsuario;
	created_at: Date | null;
}

export interface ReporteAdminItemDto {
	id_reporte: number;
	tipo_objeto: string;
	id_objeto: number;
	motivo: string;
	descripcion: string;
	estado: string | null;
	created_at: Date | null;
	fecha_resolucion: Date | null;
	comentario_resolucion: string | null;
	reportante: {
		id_usuario: number;
		username: string;
		nombre: string;
		apellido: string;
	};
	reportado: {
		id: number;
		tipo: string;
		nombre: string;
	};
}

export interface RegistroAuditoriaAdminDto {
	id_cambio: number;
	tipo_objeto: string;
	id_objeto: number;
	accion: string;
	atributo_afectado: string;
	valor_anterior: string;
	valor_nuevo: string;
	justificacion: string | null;
	created_at: Date | null;
	usuario_id: number | null;
	admin: {
		id_usuario: number;
		username: string;
		nombre: string;
		apellido: string;
	} | null;
}

export interface AuditoriaPaginadaAdminDto {
	items: RegistroAuditoriaAdminDto[];
	total: number;
	page: number;
	pageSize: number;
}
