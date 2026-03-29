import { json, type RequestHandler } from '@sveltejs/kit';
import { PostgresConsentimientoRepository } from '$lib/infrastructure/supabase/postgres/consentimiento.repo';
import { RegistrarConsentimiento } from '$lib/domain/use-cases/consentimiento/RegistrarConsentimiento';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.usuario?.id_usuario || !locals.usuario.rol) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const targetParam = url.searchParams.get('id_usuario');
	let usuarioId = locals.usuario.id_usuario;

	if (targetParam !== null) {
		if (locals.usuario.rol !== 'administrador') {
			return json({ error: 'No autorizado' }, { status: 403 });
		}
		const parsed = parseInt(targetParam, 10);
		if (Number.isNaN(parsed)) {
			return json({ error: 'id_usuario inválido' }, { status: 400 });
		}
		usuarioId = parsed;
	}

	const repo = new PostgresConsentimientoRepository();
	const list = await repo.findByUsuario(usuarioId);
	return json(list);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario?.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { tipo, version } = body;
		if (!tipo || !version) {
			return json({ error: 'tipo y version son obligatorios' }, { status: 400 });
		}

		const repo = new PostgresConsentimientoRepository();
		const useCase = new RegistrarConsentimiento(repo);
		const row = await useCase.execute(
			locals.usuario.id_usuario,
			locals.usuario.id_usuario,
			tipo,
			String(version)
		);
		return json(row, { status: 201 });
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : 'Error interno';
		return json({ error: msg }, { status: 400 });
	}
};
