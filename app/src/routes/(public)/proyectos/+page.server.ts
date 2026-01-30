import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { GetAllProvincias } from '$lib/domain/use-cases/ubicacion/GetAllProvincias';
import { ProvinciaRepoPrisma } from '$lib/infrastructure/supabase/postgres/provincia.repo';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresEstadoRepository } from '$lib/infrastructure/supabase/postgres/estado.repo';
import { ListarEstados } from '$lib/domain/use-cases/maestros/ListarEstados';
import { PostgresCategoriaRepository } from '$lib/infrastructure/supabase/postgres/categoria.repo';
import { ListarCategorias } from '$lib/domain/use-cases/maestros/ListarCategorias';
import { PostgresTipoParticipacionRepository } from '$lib/infrastructure/supabase/postgres/tipo-participacion.repo';
import { ListarTiposParticipacion } from '$lib/domain/use-cases/maestros/ListarTiposParticipacion';

export const load: PageServerLoad = async () => {
	try {
		const provinciaRepo = new ProvinciaRepoPrisma();
		const getAllProvincias = new GetAllProvincias(provinciaRepo);

		const estadoRepo = new PostgresEstadoRepository();
		const listarEstados = new ListarEstados(estadoRepo);

		const categoriaRepo = new PostgresCategoriaRepository();
		const listarCategorias = new ListarCategorias(categoriaRepo);

		const tipoParticipacionRepo = new PostgresTipoParticipacionRepository();
		const listarTiposParticipacion = new ListarTiposParticipacion(tipoParticipacionRepo);

		const proyectoRepo = new PostgresProyectoRepository();

		// Ejecutamos con catch individual para que no explote todo si falta una tabla maestra
		const [provincias, estados, categorias, tiposParticipacion, proyectos] = await Promise.all([
			getAllProvincias.execute().catch((err) => {
				console.error('Error fetching provincias:', err);
				return [];
			}),
			listarEstados.execute().catch((err) => {
				console.error('Error fetching estados:', err);
				return [];
			}),
			listarCategorias.execute().catch((err) => {
				console.error('Error fetching categorias:', err);
				return [];
			}),
			listarTiposParticipacion.execute().catch((err) => {
				console.error('Error fetching tipos:', err);
				return [];
			}),
			// Usar findAllSummary() para listado de proyectos
			proyectoRepo.findAllSummary().catch((err) => {
				console.error('Error fetching projects:', err);
				return [];
			})
		]);

		return {
			proyectos: JSON.parse(JSON.stringify(proyectos)),
			provincias: provincias.map((p) => p.nombre),
			estados: estados.map((e) => e.descripcion),
			categorias: categorias.map((c) => c.descripcion),
			tiposParticipacion: tiposParticipacion.map((t) => t.descripcion)
		};
	} catch (e) {
		console.error('Unexpected error loading projects page:', e);
		return {
			proyectos: [],
			provincias: [],
			estados: [],
			categorias: [],
			tiposParticipacion: []
		};
	}
};
