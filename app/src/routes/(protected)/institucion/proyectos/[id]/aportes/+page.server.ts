import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
import { mockColaboraciones } from '$lib/infrastructure/mocks/mock-colaboraciones';
import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
import { mockColaboracionTipoParticipacion } from '$lib/infrastructure/mocks/mock-colaboracion-tipo-participacion';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);
	const project = mockProyectos.find((p) => p.id_proyecto === projectId);

	if (!project) {
		throw error(404, 'Proyecto no encontrado');
	}

	const approvedCollaborations = mockColaboraciones.filter(
		(c) => c.proyecto_id === projectId && c.estado === 'aprobada'
	);

	const collaboratorIds = [
		...new Set(approvedCollaborations.map((c) => c.colaborador_id).filter((id) => id !== undefined))
	];

	const colaboradoresList = collaboratorIds
		.map((userId) => {
			const user = Object.values(mockUsuarios).find((u) => u.id_usuario === userId);
			if (!user) return null;

			const userCollaborations = approvedCollaborations.filter((c) => c.colaborador_id === userId);

			let aportes: { cosa: string; cantidad: string }[] = [];

			userCollaborations.forEach((colab) => {
				const participations = mockColaboracionTipoParticipacion.filter(
					(ctp) => ctp.colaboracion_id === colab.id_colaboracion
				);

				participations.forEach((p) => {
					const permitida = project.participacion_permitida?.find(
						(pp) => pp.id_participacion_permitida === p.participacion_permitida_id
					);

					if (permitida && permitida.tipo_participacion) {
						let cosa = '';
						let cantidad = '';

						if (permitida.tipo_participacion.descripcion === 'Monetaria') {
							cosa = 'Donación monetaria';
							cantidad = `$${p.cantidad}`;
						} else {
							if (permitida.especie) {
								cosa = permitida.especie;
							} else if (permitida.tipo_participacion.descripcion === 'Voluntariado') {
								const unidad = permitida.unidad_medida || 'voluntarios';
								cosa = unidad.charAt(0).toUpperCase() + unidad.slice(1);
							} else {
								cosa = permitida.tipo_participacion.descripcion;
							}

							cosa = cosa.charAt(0).toUpperCase() + cosa.slice(1);
							const unidad = permitida.unidad_medida || '';
							cantidad = `${p.cantidad} ${unidad}`;
						}

						aportes.push({ cosa, cantidad });
					}
				});
			});

			const nombre = user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username;
			
			let tipoLabel = 'Colaborador';
			if ('tipo_colaborador' in user) {
				const tipo = (user as any).tipo_colaborador;
				if (tipo === 'organizacion') tipoLabel = 'Colaborador - ONG';
				else tipoLabel = 'Colaborador - Voluntario/a';
			}

			const displayName = ('nombre_legal' in user ? (user as any).nombre_legal : nombre) as string;

			return {
				id_usuario: user.id_usuario ?? userId,
				nombre: displayName,
				tipo_colaborador: tipoLabel,
				aportes
			};
		})
		.filter((x) => x !== null);

	return {
		colaboradores: colaboradoresList,
		projectName: project.titulo
	};
};
