import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';
import { MockUsuarioRepository } from '$lib/infrastructure/repositories/mock/MockUsuarioRepository';
import { MockColaboracionRepository } from '$lib/infrastructure/repositories/mock/MockColaboracionRepository';
import { ObtenerDetalleAportesColaborador } from '$lib/domain/use-cases/colaboraciones/ObtenerDetalleAportesColaborador';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);
	const collaboratorId = Number(params.colaboradorId);

	const proyectoRepo = new MockProyectoRepository();
	const usuarioRepo = new MockUsuarioRepository();
	const colaboracionRepo = new MockColaboracionRepository();

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
			colaborador: {
				...colaborador,
				tipo_etiqueta: tipoLabel
			},
			aportes,
			colaboradores
		};
	} catch (e) {
		console.error(e);
		throw error(404, 'Error al cargar el detalle del colaborador');
	}
};
