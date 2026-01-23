import type { LayoutServerLoad } from './$types';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';
import { mockVerificaciones } from '$lib/infrastructure/mocks/mock-verificaciones';

export const load: LayoutServerLoad = async () => {
	const repo = new MockProyectoRepository();
	const proyectos = await repo.findAll();

	return {
		proyectos,
		verificaciones: mockVerificaciones
	};
};
