import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresTipoParticipacionRepository } from '$lib/infrastructure/supabase/postgres/tipo-participacion.repo';
import { ListarTiposParticipacion } from '$lib/domain/use-cases/maestros/ListarTiposParticipacion';

export const GET: RequestHandler = async () => {
	const repo = new PostgresTipoParticipacionRepository();
	const useCase = new ListarTiposParticipacion(repo);
	const tipos = await useCase.execute();
	return json(tipos);
};
