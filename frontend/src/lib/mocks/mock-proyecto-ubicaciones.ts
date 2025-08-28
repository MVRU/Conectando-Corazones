import type { ProyectoUbicacion } from '$lib/types/Proyecto_direccion';
import { mockDirecciones } from '$lib/mocks/mock-direcciones';

const ubicacionesBase: ProyectoUbicacion[] = [
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

export const mockProyectoUbicaciones: ProyectoUbicacion[] = ubicacionesBase.map((ubicacion) => {
    const direccion = mockDirecciones.find((d) => d.id_direccion === ubicacion.direccion_id);
    if (!direccion?.localidad?.provincia) {
        throw new Error(
            `La dirección ${ubicacion.direccion_id} no posee localidad o provincia definida`
        );
    }
    return { ...ubicacion, direccion };
});