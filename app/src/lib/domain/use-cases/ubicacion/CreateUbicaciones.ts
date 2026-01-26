import type {
    UbicacionRepository,
    UbicacionCreateData
} from '$lib/domain/repositories/UbicacionRepository';
import { Ubicacion } from '$lib/domain/entities/Ubicacion';

export interface CreateUbicacionesInput {
    proyectoId: number;
    ubicaciones: UbicacionCreateData[];
}

export class CreateUbicaciones {
    constructor(private readonly repository: UbicacionRepository) { }

    async execute(input: CreateUbicacionesInput) {
        const { proyectoId, ubicaciones } = input;

        if (!proyectoId || proyectoId <= 0) {
            throw new Error('El ID del proyecto debe ser un número positivo');
        }

        if (!ubicaciones || ubicaciones.length === 0) {
            throw new Error('Debe proporcionar al menos una ubicación');
        }

        // Validar invariantes de dominio
        ubicaciones.forEach((ub) => new Ubicacion(ub));

        return this.repository.createWithProyectoRelation(proyectoId, ubicaciones);
    }
}

