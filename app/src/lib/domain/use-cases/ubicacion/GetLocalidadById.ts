// Caso de uso: Obtener localidad por ID
import type { LocalidadRepository } from '$lib/domain/repositories/LocalidadRepository';
import type { Localidad } from '$lib/domain/entities/Localidad';

export class GetLocalidadById {
    constructor(private readonly repository: LocalidadRepository) { }

    async execute(id: number): Promise<Localidad | null> {
        if (!id) return null;
        return this.repository.findById(id);
    }
}
