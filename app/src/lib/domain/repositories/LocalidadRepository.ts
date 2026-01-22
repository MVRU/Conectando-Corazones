// Repositorio de Localidades - Contrato para acceso a datos
import type { Localidad } from '$lib/domain/entities/Localidad';

export interface LocalidadRepository {
	findAll(): Promise<Localidad[]>;
	findById(id: number): Promise<Localidad | null>;
	findByProvinciaId(idProvincia: number): Promise<Localidad[]>;
}
