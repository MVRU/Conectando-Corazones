import type { ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';

export const mockProyectoUbicaciones: ProyectoUbicacion[] = [
    {
        id_proyecto_ubicacion: 1,
        proyecto_id: 1,
        direccion_id: 1,
        tipo_ubicacion: 'principal'
    },
    {
        id_proyecto_ubicacion: 2,
        proyecto_id: 1,
        direccion_id: 2,
        tipo_ubicacion: 'voluntariado'
    },
    {
        id_proyecto_ubicacion: 3,
        proyecto_id: 2,
        direccion_id: 3,
        tipo_ubicacion: 'principal'
    },
    {
        id_proyecto_ubicacion: 4,
        proyecto_id: 2,
        direccion_id: 4,
        tipo_ubicacion: 'alternativa'
    }
];