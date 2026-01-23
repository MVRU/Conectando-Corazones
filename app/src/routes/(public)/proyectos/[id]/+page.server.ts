import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) {
		throw error(404, 'Proyecto no encontrado');
	}

	const repo = new MockProyectoRepository();
	const proyecto = await repo.findById(id);

	if (!proyecto) {
		throw error(404, 'Proyecto no encontrado');
	}

	return {
		proyecto
	};
};
