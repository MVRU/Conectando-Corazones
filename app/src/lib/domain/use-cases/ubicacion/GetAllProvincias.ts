// Caso de uso: Obtener todas las provincias
import type { ProvinciaRepository } from '$lib/domain/repositories/ProvinciaRepository';
import type { Provincia } from '$lib/domain/entities/Provincia';

export class GetAllProvincias {
    constructor(private readonly repository: ProvinciaRepository) { }

    async execute(): Promise<Provincia[]> {
        return this.repository.findAll();
    }
}
