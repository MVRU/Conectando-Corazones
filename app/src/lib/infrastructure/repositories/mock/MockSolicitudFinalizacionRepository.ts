import type { SolicitudFinalizacionRepository } from '$lib/domain/repositories/SolicitudFinalizacionRepository';
import type { SolicitudFinalizacion } from '$lib/domain/types/SolicitudFinalizacion';
import { mockSolicitudesFinalizacion } from '$lib/infrastructure/mocks/mock-solicitudes-finalizacion';

export class MockSolicitudFinalizacionRepository implements SolicitudFinalizacionRepository {
	private solicitudes: SolicitudFinalizacion[] = [...mockSolicitudesFinalizacion];

	async findByProyectoId(proyectoId: number): Promise<SolicitudFinalizacion | null> {
		return (
			this.solicitudes.find(
				(s) => s.proyecto_id === Number(proyectoId) && s.estado === 'pendiente'
			) || null
		);
	}

	async updateEstado(
		id: number,
		estado: string,
		motivoRechazo?: string
	): Promise<SolicitudFinalizacion> {
		const index = this.solicitudes.findIndex((s) => s.id_solicitud === id);
		if (index === -1) {
			throw new Error('Solicitud no encontrada');
		}

		this.solicitudes[index] = {
			...this.solicitudes[index],
			estado
		};

		return this.solicitudes[index];
	}

	async countRechazadasByProyectoId(proyectoId: number): Promise<number> {
		return this.solicitudes.filter(
			(s) => s.proyecto_id === Number(proyectoId) && s.estado === 'rechazada'
		).length;
	}

	async create(solicitud: SolicitudFinalizacion): Promise<SolicitudFinalizacion> {
		const newSolicitud = { ...solicitud, id_solicitud: this.solicitudes.length + 1 };
		this.solicitudes.push(newSolicitud);
		return newSolicitud;
	}
}
