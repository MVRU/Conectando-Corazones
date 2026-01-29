import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { ParametroRepoPrisma } from '$lib/infrastructure/supabase/postgres/parametro.repo';
import { GetAllParametros } from '$lib/domain/use-cases/parametros/GetAllParametros';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.usuario || locals.usuario.rol !== 'administrador') {
		throw error(403, 'Acceso denegado');
	}

	const q = url.searchParams.get('q') || undefined;
	const repo = new ParametroRepoPrisma();
	const useCase = new GetAllParametros(repo);

	const parametros = await useCase.execute(q);

	return {
		parametros: JSON.parse(JSON.stringify(parametros)),
		filtro: q
	};
};
