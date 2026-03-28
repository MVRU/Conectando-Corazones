import { json, type RequestHandler } from '@sveltejs/kit';
import { PostgresVerificacionRepository } from '$lib/infrastructure/supabase/postgres/verificacion.repo';
import { SolicitarVerificacion } from '$lib/domain/use-cases/verificacion/SolicitarVerificacion';

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

	const repo = new PostgresVerificacionRepository();
	const list = await repo.findByUsuario(usuarioId);
	return json(list);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.usuario?.id_usuario) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { tipo } = body;
		if (!tipo) {
			return json({ error: 'tipo es obligatorio' }, { status: 400 });
		}

		// TODO (Marina Milo): Validar que no exista ya una solicitud de este 'tipo' en estado 'pendiente' para evitar duplicados

		const repo = new PostgresVerificacionRepository();
		const useCase = new SolicitarVerificacion(repo);
		const row = await useCase.execute(locals.usuario.id_usuario, locals.usuario.id_usuario, tipo);
		return json(row, { status: 201 });
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : 'Error interno';
		return json({ error: msg }, { status: 400 });
	}
};
