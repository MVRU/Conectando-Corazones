import type { MotivoReporte } from '../types/Reporte';

export class Reporte {
	id_reporte?: number;
	tipo_objeto: string;
	id_objeto: number;
	motivo: MotivoReporte;
	descripcion: string;
	estado: 'pendiente' | 'verificado' | 'desestimado';
	created_at?: Date;
	fecha_resolucion?: Date | null;
	comentario_resolucion?: string | null;
	reportante_id: number;
	admin_id?: number | null;
	nombre_objeto?: string;
	imagen_objeto?: string | null;

	reportante?: { id_usuario: number; username: string; url_foto?: string | null };
	admin?: { id_usuario: number; username: string } | null;

	constructor(data: Partial<Reporte>) {
		this.id_reporte = data.id_reporte;
		const tipoRaw = data.tipo_objeto ?? '';
		this.tipo_objeto = tipoRaw.charAt(0).toUpperCase() + tipoRaw.slice(1).toLowerCase();
		this.id_objeto = data.id_objeto ?? 0;
		this.motivo = data.motivo as MotivoReporte;
		this.descripcion = (data.descripcion ?? '').trim();
		this.estado = data.estado ?? 'pendiente';
		this.created_at = data.created_at;
		this.fecha_resolucion = data.fecha_resolucion ?? null;
		this.comentario_resolucion = data.comentario_resolucion ?? null;
		this.reportante_id = data.reportante_id ?? 0;
		this.admin_id = data.admin_id ?? null;
		this.nombre_objeto = data.nombre_objeto;
		this.imagen_objeto = data.imagen_objeto;
		this.reportante = data.reportante;
		this.admin = data.admin;

		this.validar();
	}

	private validar(): void {
		if (!this.descripcion || this.descripcion.length < 20) {
			throw new Error('La descripción del reporte debe tener al menos 20 caracteres.');
		}
		if (this.descripcion.length > 800) {
			throw new Error('La descripción no puede superar los 800 caracteres.');
		}
		if (!this.reportante_id) {
			throw new Error('El ID del reportante es requerido.');
		}
		if (!this.id_objeto) {
			throw new Error('El ID del objeto reportado es requerido.');
		}
	}

	// --- Lógica de negocio ---

	estaPendiente(): boolean {
		return this.estado === 'pendiente';
	}

	estaVerificado(): boolean {
		return this.estado === 'verificado';
	}

	estaDesestimado(): boolean {
		return this.estado === 'desestimado';
	}

	puedeSerProcesado(): boolean {
		return this.estaPendiente();
	}

	verificar(adminId: number, comentario?: string): void {
		if (!this.puedeSerProcesado()) {
			throw new Error(`El reporte ya fue procesado con estado: ${this.estado}`);
		}
		this.estado = 'verificado';
		this.admin_id = adminId;
		this.fecha_resolucion = new Date();
		this.comentario_resolucion = comentario ?? null;
	}

	desestimar(adminId: number, comentario?: string): void {
		if (!this.puedeSerProcesado()) {
			throw new Error(`El reporte ya fue procesado con estado: ${this.estado}`);
		}
		this.estado = 'desestimado';
		this.admin_id = adminId;
		this.fecha_resolucion = new Date();
		this.comentario_resolucion = comentario ?? null;
	}
}
