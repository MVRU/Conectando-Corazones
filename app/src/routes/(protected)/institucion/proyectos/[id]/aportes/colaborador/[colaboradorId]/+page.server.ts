import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';
import { ObtenerDetalleAportesColaborador } from '$lib/domain/use-cases/colaboraciones/ObtenerDetalleAportesColaborador';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);
	const collaboratorId = Number(params.colaboradorId);

	const proyectoRepo = new PostgresProyectoRepository();
	const usuarioRepo = new PostgresUsuarioRepository();
	const colaboracionRepo = new PostgresColaboracionRepository();

	const obtenerDetalle = new ObtenerDetalleAportesColaborador(
		colaboracionRepo,
		proyectoRepo,
		usuarioRepo
	);

	try {
		const { colaborador, aportes, colaboradores } = await obtenerDetalle.execute(
			projectId,
			collaboratorId
		);

		let tipoLabel = 'Colaborador';
		if ('tipo_colaborador' in colaborador) {
			const tipo = (colaborador as any).tipo_colaborador;
			if (tipo === 'organizacion') tipoLabel = 'Colaborador - ONG';
			else tipoLabel = 'Colaborador - Voluntario/a';
		}

		return {
			colaborador: JSON.parse(
				JSON.stringify({
					...colaborador,
					tipo_etiqueta: tipoLabel
				})
			),
			aportes: JSON.parse(JSON.stringify(aportes)),
			colaboradores: JSON.parse(JSON.stringify(colaboradores))
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Error al cargar el detalle del colaborador');
	}
};
