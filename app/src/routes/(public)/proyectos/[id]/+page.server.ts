import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const id = Number(params.id);
		if (isNaN(id)) {
			throw error(404, 'Proyecto no encontrado');
		}

		const repo = new PostgresProyectoRepository();
		const proyecto = await repo.findById(id);

		if (!proyecto) {
			throw error(404, 'Proyecto no encontrado');
		}

		return {
			proyecto: JSON.parse(JSON.stringify(proyecto))
		};
	} catch (err: any) {
		console.error('Error loading project:', err);

		// Si es un error 404 (provocado por throw error(404)), lo dejamos pasar a la página de error de SvelteKit
		if (err?.status === 404) {
			throw err;
		}

		// Para cualquier otro error (DB caída, datos inconsistentes, etc.)
		// retornamos el error para que la página pueda mostrar un mensaje amigable sin "romperse"
		return {
			proyecto: null,
			error:
				'Hubo un problema al cargar los detalles del proyecto. Por favor, intentá nuevamente más tarde.'
		};
	}
};
