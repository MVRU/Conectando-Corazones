import type { ParticipacionPermitida } from '../entities/ParticipacionPermitida';

export interface ParticipacionPermitidaRepository {
	findAllByProyecto(id_proyecto: number): Promise<ParticipacionPermitida[]>;
	findById(id: number): Promise<ParticipacionPermitida | null>;
	save(participacion: ParticipacionPermitida): Promise<ParticipacionPermitida>;
	delete(id: number): Promise<void>;
}
