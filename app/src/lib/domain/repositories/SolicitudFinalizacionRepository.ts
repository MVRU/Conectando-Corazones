import type { SolicitudFinalizacion } from '$lib/domain/types/SolicitudFinalizacion';

export interface SolicitudFinalizacionRepository {
	findByProyectoId(proyectoId: number): Promise<SolicitudFinalizacion | null>;
	updateEstado(id: number, estado: string, motivoRechazo?: string): Promise<SolicitudFinalizacion>;
	countRechazadasByProyectoId(proyectoId: number): Promise<number>;
	create(solicitud: SolicitudFinalizacion): Promise<SolicitudFinalizacion>;
}
