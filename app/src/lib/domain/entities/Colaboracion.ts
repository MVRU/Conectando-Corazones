import type { ColaboradorDisyuncion } from '../types/Usuario';
import type { ColaboracionTipoParticipacion } from '../types/ColaboracionTipoParticipacion';

export class Colaboracion {
	id_colaboracion?: number;
	estado: 'pendiente' | 'aprobada' | 'rechazada' | 'anulada';
	justificacion?: string;
	created_at?: Date;
	mensaje?: string;

	// Claves foráneas
	proyecto_id?: number;
	colaborador_id?: number;

	// Relaciones
	colaborador?: ColaboradorDisyuncion;
	colaboraciones_tipo_participacion?: ColaboracionTipoParticipacion[];

	constructor(data: Partial<Colaboracion>) {
		this.id_colaboracion = data.id_colaboracion;
		this.estado = data.estado || 'pendiente';
		this.justificacion = data.justificacion;
		this.created_at = data.created_at;
		this.mensaje = data.mensaje;
		this.proyecto_id = data.proyecto_id;
		this.colaborador_id = data.colaborador_id;
		this.colaborador = data.colaborador;
		this.colaboraciones_tipo_participacion = data.colaboraciones_tipo_participacion;

		this.validar();
	}

	private validar(): void {
		if (!this.proyecto_id) {
			throw new Error('El ID del proyecto es requerido para la colaboración.');
		}
		if (!this.colaborador_id) {
			throw new Error('El ID del colaborador es requerido.');
		}
		if (this.mensaje && this.mensaje.length > 500) {
			throw new Error('El mensaje no puede superar los 500 caracteres.');
		}
	}

	// Lógica de negocio
	estaAprobada(): boolean {
		return this.estado === 'aprobada';
	}

	estaPendiente(): boolean {
		return this.estado === 'pendiente';
	}

	estaRechazada(): boolean {
		return this.estado === 'rechazada';
	}

	estaAnulada(): boolean {
		return this.estado === 'anulada';
	}

	puedeSerModificada(): boolean {
		return this.estado === 'pendiente';
	}

	aprobar(justificacion?: string): void {
		if (!this.puedeSerModificada()) {
			throw new Error('Solo se pueden aprobar colaboraciones pendientes');
		}
		this.estado = 'aprobada';
		this.justificacion = justificacion;
	}

	rechazar(justificacion: string): void {
		if (!this.puedeSerModificada()) {
			throw new Error('Solo se pueden rechazar colaboraciones pendientes');
		}
		if (!justificacion) {
			throw new Error('Se requiere justificación para rechazar una colaboración');
		}
		this.estado = 'rechazada';
		this.justificacion = justificacion;
	}

	anular(): void {
		if (this.estado !== 'pendiente') {
			throw new Error('Solo se pueden anular colaboraciones en estado pendiente');
		}
		if (this.estado !== 'pendiente') {
			throw new Error('Solo se pueden cancelar postulaciones en estado pendiente');
		}
		this.estado = 'anulada';
	}
}
