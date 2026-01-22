// Caso de uso: Obtener provincia por ID
import type { ProvinciaRepository } from '$lib/domain/repositories/ProvinciaRepository';
import type { Provincia } from '$lib/domain/entities/Provincia';

export class GetProvinciaById {
    constructor(private readonly repository: ProvinciaRepository) { }

    async execute(id: number): Promise<Provincia | null> {
        return this.repository.findById(id);
    }
}
