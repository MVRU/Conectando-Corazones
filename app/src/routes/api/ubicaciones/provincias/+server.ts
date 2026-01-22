// API Endpoint: GET /api/ubicaciones/provincias
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ProvinciaRepoPrisma } from '$lib/infrastructure/supabase/postgres/provincia.repo';
import { GetAllProvincias } from '$lib/domain/use-cases/ubicacion/GetAllProvincias';

export const GET: RequestHandler = async () => {
    try {
        const repository = new ProvinciaRepoPrisma();
        const useCase = new GetAllProvincias(repository);
        const provincias = await useCase.execute();

        return json(provincias);
    } catch (e) {
        console.error('Error fetching provincias:', e);
        throw error(500, 'Error al obtener provincias');
    }
};
