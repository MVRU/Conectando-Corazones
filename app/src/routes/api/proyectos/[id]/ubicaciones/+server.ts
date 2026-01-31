import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ProyectoUbicacionRepoPrisma } from '$lib/infrastructure/supabase/postgres/proyecto-ubicacion.repo';
import { GetUbicacionesByProyecto, AddUbicacionToProyecto } from '$lib/domain/use-cases/proyecto-ubicacion';
import type { UbicacionCreate } from '$lib/domain/types/dto/UbicacionCreate';

const repository = new ProyectoUbicacionRepoPrisma();

/**
 * GET /api/proyectos/[id]/ubicaciones
 * Obtiene todas las ubicaciones de un proyecto
 */
export const GET: RequestHandler = async ({ params }) => {
    const proyectoId = parseInt(params.id);

    if (isNaN(proyectoId)) {
        throw error(400, 'ID de proyecto inválido');
    }

    try {
        const useCase = new GetUbicacionesByProyecto(repository);
        const ubicaciones = await useCase.execute({ proyectoId });

        return json(ubicaciones);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Error al obtener ubicaciones';
        throw error(500, message);
    }
};

/**
 * POST /api/proyectos/[id]/ubicaciones
 * Crea una nueva ubicación y la asocia al proyecto
 */
export const POST: RequestHandler = async ({ params, request }) => {
    const proyectoId = parseInt(params.id);

    if (isNaN(proyectoId)) {
        throw error(400, 'ID de proyecto inválido');
    }

    try {
        const body = await request.json();

        if (!body.tipo_ubicacion || !body.modalidad) {
            throw error(400, 'Se requiere tipo_ubicacion y modalidad');
        }

        const ubicacionData: UbicacionCreate = {
            tipo_ubicacion: body.tipo_ubicacion,
            modalidad: body.modalidad,
            direccion_presencial: body.direccion_presencial,
            url_virtual: body.url_virtual
        };

        const useCase = new AddUbicacionToProyecto(repository);
        const nuevaRelacion = await useCase.execute({
            proyectoId,
            ubicacion: ubicacionData
        });

        return json(nuevaRelacion, { status: 201 });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Error al agregar ubicación';

        if (message.includes('Ya existe una ubicación')) {
            throw error(409, message);
        }

        if (
            message.includes('no encontrado') ||
            message.includes('No se pueden agregar') ||
            message.includes('requerido') ||
            message.includes('obligatorio') ||
            message.includes('debe ser')
        ) {
            throw error(400, message);
        }

        throw error(500, message);
    }
};

