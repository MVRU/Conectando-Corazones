// Caso de uso: Obtener localidades por provincia
import type { LocalidadRepository } from '$lib/domain/repositories/LocalidadRepository';
import type { Localidad } from '$lib/domain/entities/Localidad';

export class GetLocalidadesByProvincia {
    constructor(private readonly repository: LocalidadRepository) { }

    async execute(idProvincia: number): Promise<Localidad[]> {
        if (!idProvincia) return [];
        return this.repository.findByProvinciaId(idProvincia);
    }
}
