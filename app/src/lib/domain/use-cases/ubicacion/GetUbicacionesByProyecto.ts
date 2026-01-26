import type { UbicacionRepository } from '$lib/domain/repositories/UbicacionRepository';
import type { Ubicacion } from '$lib/domain/entities/Ubicacion';

export class GetUbicacionesByProyecto {
    constructor(private readonly repository: UbicacionRepository) { }

    async execute(proyectoId: number): Promise<Ubicacion[]> {
        if (!proyectoId || proyectoId <= 0) {
            throw new Error('El ID del proyecto debe ser un número positivo');
        }
        return this.repository.findByProyectoId(proyectoId);
    }
}
