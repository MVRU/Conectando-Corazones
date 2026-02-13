import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { usuario } = locals;

	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	const usuarioPojo = usuario.toPOJO();

	if (usuario.rol === 'administrador') {
		throw redirect(303, '/admin/panel-admin'); // TODO: implementar panel admin
	}

	if (usuario.rol === 'institucion') {
		throw redirect(303, '/institucion/mi-panel');
	}

	if (usuario.rol === 'colaborador') {
		throw redirect(303, '/colaborador/mi-panel');
	}

	throw redirect(303, '/');
};
