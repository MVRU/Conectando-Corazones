export interface HistorialDeCambios {
	id_cambio?: number;
	tipo_objeto: 'Usuario' | 'Proyecto' | 'Resena' | 'Reporte' | 'Categoria' | string;
	id_objeto: number;
	accion: 'creado' | 'actualizado' | 'eliminado' | 'aprobado' | 'rechazado' | 'suspendido' | 'activado' | string;
	atributo_afectado?: string; // Ej: 'estado', 'titulo', 'descripcion', 'aprobado'
	valor_anterior?: string | null;
	valor_nuevo?: string | null;
	justificacion?: string | null;
	created_at?: Date;
	usuario_id?: number; // Usuario que realizó el cambio (admin)
}
