import type { ParticipacionPermitida } from '../entities/ParticipacionPermitida';

export interface ParticipacionPermitidaRepository {
	findByProyectoId(proyectoId: number): Promise<ParticipacionPermitida[]>;
	create(participacion: ParticipacionPermitida): Promise<ParticipacionPermitida>;
	update(participacion: ParticipacionPermitida): Promise<ParticipacionPermitida>;
	delete(id: number): Promise<void>;
}
