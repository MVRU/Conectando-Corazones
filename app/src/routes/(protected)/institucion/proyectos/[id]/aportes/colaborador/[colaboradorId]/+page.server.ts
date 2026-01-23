import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
import { mockColaboraciones } from '$lib/infrastructure/mocks/mock-colaboraciones';
import { mockColaboracionTipoParticipacion } from '$lib/infrastructure/mocks/mock-colaboracion-tipo-participacion';
import { mockEvidencias } from '$lib/infrastructure/mocks/mock-evidencias';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const projectId = Number(params.id);
	const collaboratorId = Number(params.colaboradorId);

	const project = mockProyectos.find((p) => p.id_proyecto === projectId);
	if (!project) throw error(404, 'Proyecto no encontrado');

	const collaborator = Object.values(mockUsuarios).find((u) => u.id_usuario === collaboratorId);
	if (!collaborator) throw error(404, 'Colaborador no encontrado');

	const userCollaborations = mockColaboraciones.filter(
		(c) =>
			c.proyecto_id === projectId &&
			c.colaborador_id === collaboratorId &&
			c.estado === 'aprobada'
	);

	const aportes = userCollaborations.flatMap((colab) => {
		const participations = mockColaboracionTipoParticipacion.filter(
			(ctp) => ctp.colaboracion_id === colab.id_colaboracion
		);

		return participations.map((p) => {
			const permitida = project.participacion_permitida?.find(
				(pp) => pp.id_participacion_permitida === p.participacion_permitida_id
			);

			if (!permitida) return null;

			let titulo = '';
			let cantidad = '';

			if (permitida.tipo_participacion?.descripcion === 'Monetaria') {
				titulo = 'Donación monetaria';
				cantidad = `$${p.cantidad}`;
			} else if (permitida.tipo_participacion?.descripcion === 'Voluntariado') {
				titulo = 'Voluntariado';
				const unidad = permitida.unidad_medida || '';
				cantidad = `${p.cantidad} ${unidad}`;
			} else {
				if (permitida.especie) {
					titulo = permitida.especie;
				} else {
					titulo = permitida.tipo_participacion?.descripcion || 'Aporte';
				}

				titulo = titulo.charAt(0).toUpperCase() + titulo.slice(1);
				const unidad = permitida.unidad_medida || '';
				cantidad = `${p.cantidad} ${unidad}`;
			}

			const evidenciasEntrada = mockEvidencias
				.filter(
					(e) =>
						e.id_participacion_permitida === p.participacion_permitida_id &&
						e.tipo_evidencia === 'entrada'
				)
				.flatMap((e) => e.archivos || [])
				.filter((a) => a.usuario_id === collaboratorId);

			const evidenciasSalida = mockEvidencias
				.filter(
					(e) =>
						e.id_participacion_permitida === p.participacion_permitida_id &&
						e.tipo_evidencia === 'salida'
				)
				.flatMap((e) => e.archivos || []);

			return {
				titulo,
				cantidad,
				evidencias_entrada: evidenciasEntrada,
				evidencias_salida: evidenciasSalida
			};
		}).filter((x) => x !== null);
	});

	let tipoLabel = 'Colaborador';
	if ('tipo_colaborador' in collaborator) {
		const tipo = (collaborator as any).tipo_colaborador;
		if (tipo === 'organizacion') tipoLabel = 'Colaborador - ONG';
		else tipoLabel = 'Colaborador - Voluntario/a';
	}
	
	const displayName = ('nombre_legal' in collaborator ? (collaborator as any).nombre_legal : (collaborator.nombre && collaborator.apellido ? `${collaborator.nombre} ${collaborator.apellido}` : collaborator.username)) as string;

	const approvedCollaborations = mockColaboraciones.filter(
		(c) => c.proyecto_id === projectId && c.estado === 'aprobada'
	);

	const allCollaboratorIds = [
		...new Set(approvedCollaborations.map((c) => c.colaborador_id).filter((id) => id !== undefined))
	];

	const colaboradoresList = allCollaboratorIds
		.map((userId) => {
			const user = Object.values(mockUsuarios).find((u) => u.id_usuario === userId);
			if (!user) return null;

			const userColabs = approvedCollaborations.filter((c) => c.colaborador_id === userId);

			let aportesList: { cosa: string; cantidad: string }[] = [];

			userColabs.forEach((colab) => {
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
						} else if (permitida.tipo_participacion.descripcion === 'Voluntariado') {
							cosa = 'Voluntariado';
							const unidad = permitida.unidad_medida || '';
							cantidad = `${p.cantidad} ${unidad}`;
						} else {
							if (permitida.especie) {
								cosa = permitida.especie;
							} else {
								cosa = permitida.tipo_participacion.descripcion;
							}

							cosa = cosa.charAt(0).toUpperCase() + cosa.slice(1);
							const unidad = permitida.unidad_medida || '';
							cantidad = `${p.cantidad} ${unidad}`;
						}

						aportesList.push({ cosa, cantidad });
					}
				});
			});

			const nombre = user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : user.username;
			
			let tipoUserLabel = 'Colaborador';
			if ('tipo_colaborador' in user) {
				const tipo = (user as any).tipo_colaborador;
				if (tipo === 'organizacion') tipoUserLabel = 'Colaborador - ONG';
				else tipoUserLabel = 'Colaborador - Voluntario/a';
			}

			const displayUserName = ('nombre_legal' in user ? (user as any).nombre_legal : nombre) as string;

			return {
				id_usuario: user.id_usuario ?? userId,
				nombre: displayUserName,
				tipo_colaborador: tipoUserLabel,
				aportes: aportesList
			};
		})
		.filter((x) => x !== null);

	return {
		colaborador: {
			...collaborator,
			tipo_etiqueta: tipoLabel
		},
		aportes: aportes as {
			titulo: string;
			cantidad: string;
			evidencias_entrada: import('$lib/domain/types/Archivo').Archivo[];
			evidencias_salida: import('$lib/domain/types/Archivo').Archivo[];
		}[],
		colaboradores: colaboradoresList
	};
};
