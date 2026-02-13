import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.usuario) {
		throw redirect(303, '/mi-panel?error=already_logged_in');
	}

	const [categorias, tiposParticipacion] = await Promise.all([
		prisma.categoria.findMany({
			select: { id_categoria: true, descripcion: true }
		}),
		prisma.tipoParticipacion.findMany({
			select: { id_tipo_participacion: true, descripcion: true }
		})
	]);

	return {
		categorias,
		tiposParticipacion
	};
};
