import type { TipoParticipacion } from '../entities/TipoParticipacion';

export interface TipoParticipacionRepository {
	findAll(): Promise<TipoParticipacion[]>;
	findById(id: number): Promise<TipoParticipacion | null>;
}
