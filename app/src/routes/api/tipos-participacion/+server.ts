import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { PostgresTipoParticipacionRepository } from '$lib/infrastructure/supabase/postgres/tipo-participacion.repo';
import { GetAllTiposParticipacion } from '$lib/domain/use-cases/maestros/GetAllTiposParticipacion';

export const GET: RequestHandler = async () => {
	const repo = new PostgresTipoParticipacionRepository();
	const useCase = new GetAllTiposParticipacion(repo);
	const tipos = await useCase.execute();
	return json(tipos);
};
