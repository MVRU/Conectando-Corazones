import { json } from '@sveltejs/kit';
import { ParametroRepoPrisma } from '$lib/infrastructure/supabase/postgres/parametro.repo';
import { GetAllParametros } from '$lib/domain/use-cases/parametros/GetAllParametros';

export async function GET({ url, locals }) {
    if (locals.usuario?.rol !== 'administrador') {
        return json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const q = url.searchParams.get('q') || '';
        const repo = new ParametroRepoPrisma();
        const useCase = new GetAllParametros(repo);

        const parametros = await useCase.execute(q);
        return json(parametros);
    } catch (error) {
        console.error('Error obteniendo parámetros:', error);
        return json(
            { error: 'Error al obtener parámetros' },
            { status: 500 }
        );
    }
}