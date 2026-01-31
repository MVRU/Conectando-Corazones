import { ProyectoUbicacion } from '$lib/domain/entities/ProyectoUbicacion';
import { mapUbicacionToDomain, type PrismaUbicacionWithLocalidad } from './ubicacion.mapper';

type PrismaProyectoUbicacionWithRelations = {
    id_proyecto_ubicacion: number;
    proyecto_id: number;
    ubicacion_id: number;
    ubicacion?: PrismaUbicacionWithLocalidad;
};

export function mapProyectoUbicacionToDomain(
    data: PrismaProyectoUbicacionWithRelations
): ProyectoUbicacion {
    return new ProyectoUbicacion({
        id_proyecto_ubicacion: data.id_proyecto_ubicacion,
        proyecto_id: data.proyecto_id,
        ubicacion_id: data.ubicacion_id,
        ubicacion: data.ubicacion ? mapUbicacionToDomain(data.ubicacion) : undefined
    });
}

export function mapProyectoUbicacionesToDomain(
    dataArray: PrismaProyectoUbicacionWithRelations[]
): ProyectoUbicacion[] {
    return dataArray.map(mapProyectoUbicacionToDomain);
}
