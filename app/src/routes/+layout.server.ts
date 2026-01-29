import type { LayoutServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { mockVerificaciones } from '$lib/infrastructure/mocks/mock-verificaciones';

export const load: LayoutServerLoad = async () => {
	try {
		const repo = new PostgresProyectoRepository();
		const proyectos = await repo.findAll();

		return {
			proyectos,
			verificaciones: mockVerificaciones
		};
	} catch (error) {
		console.error('Error en LayoutServerLoad:', error);
		return {
			proyectos: [],
			verificaciones: mockVerificaciones,
			error: 'No se pudieron cargar algunos datos globales.'
		};
	}
};
