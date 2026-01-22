// API Endpoint: GET /api/ubicaciones/provincias/[id]/localidades
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { LocalidadRepoPrisma } from '$lib/infrastructure/supabase/postgres/localidad.repo';
import { GetLocalidadesByProvincia } from '$lib/domain/use-cases/ubicacion/GetLocalidadesByProvincia';

export const GET: RequestHandler = async ({ params }) => {
    const provinciaId = parseInt(params.id);

    if (isNaN(provinciaId)) {
        throw error(400, 'ID de provincia inválido');
    }

    try {
        const repository = new LocalidadRepoPrisma();
        const useCase = new GetLocalidadesByProvincia(repository);
        const localidades = await useCase.execute(provinciaId);

        return json(localidades);
    } catch (e) {
        console.error(`Error fetching localidades for provincia ${provinciaId}:`, e);
        throw error(500, 'Error al obtener localidades');
    }
};
