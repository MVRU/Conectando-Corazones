import type { LocalidadRepository } from '$lib/domain/repositories/LocalidadRepository';
import type { Localidad } from '$lib/domain/types/Localidad';
import { mockLocalidades } from '$lib/infrastructure/mocks/mock-localidades';

export class MockLocalidadRepository implements LocalidadRepository {
	async findByProvincia(provinciaId: number): Promise<Localidad[]> {
		return mockLocalidades.filter((l) => l.id_provincia === provinciaId);
	}

	async findById(id: number): Promise<Localidad | undefined> {
		return mockLocalidades.find((l) => l.id_localidad === id);
	}
}
