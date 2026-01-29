import type { ColaboradorDisyuncion } from '../types/Usuario';

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

	constructor(data: Partial<Colaboracion>) {
		this.id_colaboracion = data.id_colaboracion;
		this.estado = data.estado || 'pendiente';
		this.justificacion = data.justificacion;
		this.created_at = data.created_at;
		this.mensaje = data.mensaje;
		this.proyecto_id = data.proyecto_id;
		this.colaborador_id = data.colaborador_id;
		this.colaborador = data.colaborador;
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
		if (this.estado === 'anulada') {
			throw new Error('La colaboración ya está anulada');
		}
		this.estado = 'anulada';
	}
}
