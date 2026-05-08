import type { LayoutServerLoad } from './$types';
import { PostgresChatRepository } from '$lib/infrastructure/supabase/postgres/chat.repo';

/**
 * Layout para rutas protegidas.
 * La validación de acceso se realiza de forma centralizada en hooks.server.ts mediante AuthGuard.
 */
export const load: LayoutServerLoad = async ({ locals }) => {
	// Puesto que hooks.server.ts ya verificó el acceso, locals.usuario está garantizado.
	const { usuario } = locals;
	const usuarioId = usuario?.id_usuario;

	let ultimoMensajeAjenoAt: string | null = null;

	if (usuarioId) {
		const chatRepo = new PostgresChatRepository();
		const fecha = await chatRepo.obtenerFechaUltimoMensajeAjeno(usuarioId);
		ultimoMensajeAjenoAt = fecha?.toISOString() ?? null;
	}

	return {
		usuario: usuario?.toPOJO() ?? null,
		ultimoMensajeAjenoAt
	};
};
