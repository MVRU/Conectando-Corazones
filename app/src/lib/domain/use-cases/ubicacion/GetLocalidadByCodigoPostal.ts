// Caso de uso: Obtener localidad por código postal
import type { LocalidadRepository } from '$lib/domain/repositories/LocalidadRepository';
import type { Localidad } from '$lib/domain/entities/Localidad';

export class GetLocalidadByCodigoPostal {
    constructor(private readonly repository: LocalidadRepository) { }

    async execute(codigoPostal: string): Promise<Localidad | null> {
        if (!codigoPostal || codigoPostal.trim() === '') return null;
        return this.repository.findByCodigoPostal(codigoPostal);
    }
}
