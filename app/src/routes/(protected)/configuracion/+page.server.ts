import type { PageServerLoad } from './$types';
import { PostgresCategoriaRepository } from '$lib/infrastructure/supabase/postgres/categoria.repo';

export const load: PageServerLoad = async () => {
	const categoriaRepo = new PostgresCategoriaRepository();
	// @ts-ignore
	const categorias = await categoriaRepo.findAll();

	return {
		categorias: JSON.parse(JSON.stringify(categorias))
	};
};
