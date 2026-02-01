import type { ProyectoCategoriaRepository } from '$lib/domain/repositories/ProyectoCategoriaRepository';
import type { ProyectoCategoria } from '$lib/domain/entities/ProyectoCategoria';

export class GetCategoriasByProyecto {
    constructor(private readonly repository: ProyectoCategoriaRepository) { }

    async execute(proyectoId: number): Promise<ProyectoCategoria[]> {
        if (!proyectoId || proyectoId <= 0) {
            throw new Error('El ID del proyecto debe ser un número positivo');
        }

        return this.repository.findByProyectoId(proyectoId);
    }
}
