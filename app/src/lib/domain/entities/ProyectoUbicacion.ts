import type { Proyecto } from '../types/Proyecto';
import type { Ubicacion } from '../entities/Ubicacion';

type ProyectoUbicacionConstructorData = {
    proyecto_id: number;
    ubicacion_id: number;
    id_proyecto_ubicacion?: number;
    proyecto?: Proyecto;
    ubicacion?: Ubicacion;
};

export class ProyectoUbicacion {
    id_proyecto_ubicacion?: number;
    proyecto_id: number;
    ubicacion_id: number;
    proyecto?: Proyecto;
    ubicacion?: Ubicacion;

    constructor(data: ProyectoUbicacionConstructorData) {
        if (!Number.isInteger(data.proyecto_id) || data.proyecto_id <= 0) {
            throw new Error('El ID del proyecto debe ser un número entero positivo');
        }

        if (!Number.isInteger(data.ubicacion_id) || data.ubicacion_id <= 0) {
            throw new Error('El ID de la ubicación debe ser un número entero positivo');
        }

        this.id_proyecto_ubicacion = data.id_proyecto_ubicacion;
        this.proyecto_id = data.proyecto_id;
        this.ubicacion_id = data.ubicacion_id;
        this.proyecto = data.proyecto;
        this.ubicacion = data.ubicacion;
    }
}