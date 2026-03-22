import { json, type RequestHandler } from '@sveltejs/kit';
import { PostgresVerificacionRepository } from '$lib/infrastructure/supabase/postgres/verificacion.repo';
import { ResolverVerificacion } from '$lib/domain/use-cases/verificacion/ResolverVerificacion';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.usuario?.id_usuario || !locals.usuario.rol) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const rawId = params.id;
	if (!rawId) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}
	const id = parseInt(rawId, 10);
	if (Number.isNaN(id)) {
		return json({ error: 'ID inválido' }, { status: 400 });
	}

	try {
		const body = await request.json();
		const { estado, fecha_vencimiento } = body;
		if (!estado) {
			return json({ error: 'estado es obligatorio' }, { status: 400 });
		}

		let fecha: Date | null | undefined = undefined;
		if (fecha_vencimiento !== undefined && fecha_vencimiento !== null) {
			fecha = new Date(fecha_vencimiento);
			if (Number.isNaN(fecha.getTime())) {
				return json({ error: 'fecha_vencimiento inválida' }, { status: 400 });
			}
		} else if (fecha_vencimiento === null) {
			fecha = null;
		}

		const repo = new PostgresVerificacionRepository();
		const useCase = new ResolverVerificacion(repo);
		const updated = await useCase.execute(
			id,
			locals.usuario.rol,
			locals.usuario.id_usuario,
			estado,
			fecha
		);
		return json(updated);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : 'Error interno';
		const status =
			msg.includes('administrador') || msg.includes('no encontrada') ? 403 : 400;
		return json({ error: msg }, { status });
	}
};
