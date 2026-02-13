import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { usuario } = locals;

	if (!usuario) {
		const from = url.pathname + url.search;
		throw redirect(303, `/iniciar-sesion?redirectTo=${encodeURIComponent(from)}`);
	}

	const path = url.pathname;

	if (path.startsWith('/admin') && usuario.rol !== 'administrador') {
		if (usuario.rol === 'institucion') throw redirect(303, '/institucion/mi-panel');
		if (usuario.rol === 'colaborador') throw redirect(303, '/colaborador/mi-panel');
		throw redirect(303, '/');
	}

	if (
		path.startsWith('/institucion') &&
		usuario.rol !== 'institucion' &&
		usuario.rol !== 'administrador'
	) {
		throw redirect(303, '/colaborador/mi-panel');
	}

	if (
		path.startsWith('/colaborador') &&
		usuario.rol !== 'colaborador' &&
		usuario.rol !== 'administrador'
	) {
		throw redirect(303, '/institucion/mi-panel');
	}

	return {
		usuario: usuario.toPOJO()
	};
};
