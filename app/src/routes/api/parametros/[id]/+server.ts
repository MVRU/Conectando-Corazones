import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { ParametroRepoPrisma } from '$lib/infrastructure/supabase/postgres/parametro.repo';
import { UpdateParametroValor } from '$lib/domain/use-cases/parametros/UpdateParametroValor';
import { GetParametroById } from '$lib/domain/use-cases/parametros/GetParametroById';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (locals.usuario?.rol !== 'administrador') return json({ error: 'Forbidden' }, { status: 403 });

	const id = Number(params.id);
	if (isNaN(id)) return json({ error: 'ID inválido' }, { status: 400 });

	const repo = new ParametroRepoPrisma();
	const useCase = new GetParametroById(repo);
	const parametro = await useCase.execute(id);

	if (!parametro) return json({ error: 'Not found' }, { status: 404 });
	return json(parametro);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (locals.usuario?.rol !== 'administrador') return json({ error: 'Forbidden' }, { status: 403 });

	const id = Number(params.id);
	if (isNaN(id)) return json({ error: 'ID inválido' }, { status: 400 });

	const { valor } = await request.json();
	const repo = new ParametroRepoPrisma();
	const useCase = new UpdateParametroValor(repo);

	try {
		const actualizado = await useCase.execute(id, valor);
		return json(actualizado);
	} catch (e) {
		const message = e instanceof Error ? e.message : 'Error desconocido';
		return json({ error: message }, { status: 400 });
	}
};
