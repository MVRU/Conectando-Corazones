import type { Localidad } from '$lib/domain/types/Localidad'; // TODO: reemplazar por la interface real de Localidad

export interface LocalidadRepository {
	findByProvincia(provinciaId: number): Promise<Localidad[]>;
	findById(id: number): Promise<Localidad | undefined>;
	// TODO: agregar update, delete, etc. segun sea necesario
}
