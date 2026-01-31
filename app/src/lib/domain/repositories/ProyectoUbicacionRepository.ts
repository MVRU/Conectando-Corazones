import type { ProyectoUbicacion } from '../entities/ProyectoUbicacion';
import type { UbicacionCreate } from '../types/dto/UbicacionCreate';

export interface ProyectoUbicacionRepository {

    findByProyectoId(proyectoId: number): Promise<ProyectoUbicacion[]>;

    createWithUbicacion(
        proyectoId: number,
        ubicacionData: UbicacionCreate
    ): Promise<ProyectoUbicacion>;

    countByProyectoId(proyectoId: number): Promise<number>;

    getEstadoProyecto(proyectoId: number): Promise<string | null>;

    existsUbicacionEquivalente(
        proyectoId: number,
        ubicacion: UbicacionCreate
    ): Promise<boolean>;
}
