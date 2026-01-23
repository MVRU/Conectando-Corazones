import type { PageServerLoad } from './$types';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';

export const load: PageServerLoad = async () => {
	const repo = new MockProyectoRepository();
	const proyectos = await repo.findAll();

	return {
		proyectos
	};
};
