// TODO: corregir todo esto

import type { LocalidadRepository } from '$lib/domain/repositories/LocalidadRepository';
import type { Localidad } from '$lib/domain/types/Localidad';

export class ObtenerLocalidades {
	constructor(private localidadRepository: LocalidadRepository) {}

	async porProvincia(idProvincia: number | undefined): Promise<Localidad[]> {
		if (idProvincia === undefined) return [];
		return this.localidadRepository.findByProvinciaId(idProvincia);
	}

	async porId(idLocalidad: number | undefined): Promise<Localidad | null> {
		if (!idLocalidad) return null;
		return this.localidadRepository.findById(idLocalidad);
	}
}
