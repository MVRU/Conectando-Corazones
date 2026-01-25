import type { LocalidadRepository } from '$lib/domain/repositories/LocalidadRepository';
import { Localidad } from '$lib/domain/entities/Localidad';
import { mockLocalidades } from '$lib/infrastructure/mocks/mock-localidades';

export class MockLocalidadRepository implements LocalidadRepository {
	async findAll(): Promise<Localidad[]> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return mockLocalidades.map((l) => new Localidad(l as any));
	}

	async findByProvinciaId(provinciaId: number): Promise<Localidad[]> {
		return mockLocalidades
			.filter((l) => l.id_provincia === provinciaId)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((l) => new Localidad(l as any));
	}

	async findById(id: number): Promise<Localidad | null> {
		const found = mockLocalidades.find((l) => l.id_localidad === id);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return found ? new Localidad(found as any) : null;
	}

	async findByCodigoPostal(codigoPostal: string): Promise<Localidad | null> {
		const found = mockLocalidades.find((l) => l.codigo_postal === codigoPostal);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return found ? new Localidad(found as any) : null;
	}
}
