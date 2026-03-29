import { json, type RequestHandler } from '@sveltejs/kit';
import { PostgresContactoRepository } from '$lib/infrastructure/supabase/postgres/contacto.repo';
import { ActualizarContacto } from '$lib/domain/use-cases/contacto/ActualizarContacto';
import { EliminarContacto } from '$lib/domain/use-cases/contacto/EliminarContacto';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.usuario?.id_usuario || !locals.usuario.rol) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const rawId = params.id_contacto;
	if (!rawId) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}
	const id = parseInt(rawId, 10);
	if (Number.isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		const body = await request.json();
		const repo = new PostgresContactoRepository();
		const useCase = new ActualizarContacto(repo);
		const updated = await useCase.execute(id, locals.usuario.id_usuario, locals.usuario.rol, {
			tipo_contacto: body.tipo_contacto,
			valor: body.valor,
			etiqueta: body.etiqueta
		});
		return json(updated);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : 'Error interno';
		const status = msg.includes('no encontrado') || msg.includes('permisos') ? 403 : 400;
		return json({ error: msg }, { status });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.usuario?.id_usuario || !locals.usuario.rol) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const rawId = params.id_contacto;
	if (!rawId) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}
	const id = parseInt(rawId, 10);
	if (Number.isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		const repo = new PostgresContactoRepository();
		const useCase = new EliminarContacto(repo);
		await useCase.execute(id, locals.usuario.id_usuario, locals.usuario.rol);
		return json({ ok: true });
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : 'Error interno';
		const status = msg.includes('no encontrado') || msg.includes('permisos') ? 403 : 400;
		return json({ error: msg }, { status });
	}
};
