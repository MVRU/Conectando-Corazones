import type { ProyectoUbicacionRepository } from '$lib/domain/repositories/ProyectoUbicacionRepository';
import type { ProyectoUbicacion } from '$lib/domain/entities/ProyectoUbicacion';

export interface GetUbicacionesByProyectoInput {
    proyectoId: number;
}

export class GetUbicacionesByProyecto {
    constructor(private readonly repository: ProyectoUbicacionRepository) { }

    async execute(input: GetUbicacionesByProyectoInput): Promise<ProyectoUbicacion[]> {
        const { proyectoId } = input;

        if (!proyectoId || proyectoId <= 0) {
            throw new Error('El ID del proyecto debe ser un número positivo');
        }

        return this.repository.findByProyectoId(proyectoId);
    }
}
