import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';

function urlPanelPorRol(rol: string): string {
	switch (rol) {
		case 'institucion':
			return '/institucion/mi-panel';
		case 'colaborador':
			return '/colaborador/mi-panel';
		case 'administrador':
			return '/admin';
		default:
			return '/';
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.usuario) {
		const base = locals.usuario.rol ? urlPanelPorRol(locals.usuario.rol) : '/';
		throw redirect(303, `${base}?error=already_logged_in`);
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
