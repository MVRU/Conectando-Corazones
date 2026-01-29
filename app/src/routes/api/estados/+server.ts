import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresEstadoRepository } from '$lib/infrastructure/supabase/postgres/estado.repo';
import { ListarEstados } from '$lib/domain/use-cases/maestros/ListarEstados';

export const GET: RequestHandler = async () => {
	const repo = new PostgresEstadoRepository();
	const useCase = new ListarEstados(repo);
	const estados = await useCase.execute();
	return json(estados);
};
