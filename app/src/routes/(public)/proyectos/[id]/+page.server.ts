import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresReporteRepository } from '$lib/infrastructure/supabase/postgres/reporte.repo';

export const load: PageServerLoad = async ({ params, locals, url }) => {
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

		// Verificar si el usuario actual tiene un reporte pendiente para este proyecto
		let tieneReportePendiente = false;
		if (locals.usuario && proyecto.id_proyecto) {
			const repRepo = new PostgresReporteRepository();
			const reporteExistente = await repRepo.findByReportanteAndObjeto(
				locals.usuario.id_usuario!,
				'Proyecto',
				proyecto.id_proyecto
			);
			tieneReportePendiente = reporteExistente?.estado === 'pendiente';
		}

		return {
			proyecto: JSON.parse(JSON.stringify(proyecto)),
			tieneReportePendiente,
			chatAviso: url.searchParams.get('chat') === 'no-habilitado'
		};
	} catch (err: unknown) {
		console.error('Error loading project:', err);

		// Si es un error 404 (provocado por throw error(404)), lo dejamos pasar a la página de error de SvelteKit
		if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
			throw err;
		}

		// Para cualquier otro error (DB caída, datos inconsistentes, etc.)
		// retornamos el error para que la página pueda mostrar un mensaje amigable sin "romperse"
		return {
			proyecto: null,
			chatAviso: false,
			error:
				'Hubo un problema al cargar los detalles del proyecto. Por favor, intentá nuevamente más tarde.'
		};
	}
};
