import { json, type RequestHandler } from '@sveltejs/kit';
import { PostgresContactoRepository } from '$lib/infrastructure/supabase/postgres/contacto.repo';
import { SincronizarContactosPerfil } from '$lib/domain/use-cases/contacto/SincronizarContactosPerfil';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.usuario?.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const repo = new PostgresContactoRepository();
	const list = await repo.findByUsuario(locals.usuario.id_usuario);
	return json(list);
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario?.id_usuario || !locals.usuario.rol) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { contactos } = body;
		if (!Array.isArray(contactos)) {
			return json({ error: 'Se esperaba contactos: []' }, { status: 400 });
		}

		const repo = new PostgresContactoRepository();
		const useCase = new SincronizarContactosPerfil(repo);
		const result = await useCase.execute(
			locals.usuario.id_usuario,
			locals.usuario.id_usuario,
			locals.usuario.rol,
			contactos
		);
		return json(result);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : 'Error interno';
		return json({ error: msg }, { status: 400 });
	}
};
