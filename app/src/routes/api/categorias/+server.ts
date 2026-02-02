import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresCategoriaRepository } from '$lib/infrastructure/supabase/postgres/categoria.repo';
import { GetAllCategorias } from '$lib/domain/use-cases/maestros/GetAllCategorias';

export const GET: RequestHandler = async () => {
	const repo = new PostgresCategoriaRepository();
	const useCase = new GetAllCategorias(repo);
	const categorias = await useCase.execute();
	return json(categorias);
};
