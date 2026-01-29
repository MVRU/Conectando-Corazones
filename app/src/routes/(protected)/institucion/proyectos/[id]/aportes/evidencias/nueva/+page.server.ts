import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
import { mockEvidencias } from '$lib/infrastructure/mocks/mock-evidencias';
import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const projectId = Number(params.id);

		if (isNaN(projectId)) {
			throw error(404, 'Proyecto no encontrado');
		}

		const project = mockProyectos.find((p) => p.id_proyecto === projectId);

		if (!project) throw error(404, 'Proyecto no encontrado');

		// Extraer tipos de participación únicos permitidos para este proyecto
		const tiposUnicos = Array.from(
			new Set(project.participacion_permitida?.map((p) => p.tipo_participacion?.descripcion) || [])
		).filter(Boolean) as string[];

		// Obtener todos los proyectos disponibles (en curso o pendiente de cierre)
		const proyectosDisponibles = mockProyectos
			.filter((p) => p.estado === 'en_curso' || p.estado === 'pendiente_solicitud_cierre')
			.map((p) => ({
				id_proyecto: p.id_proyecto,
				titulo: p.titulo,
				estado: p.estado
			}));

		// Obtener datos de la institución
		const institucion = Object.values(mockUsuarios).find(
			(u) => u.id_usuario === project.institucion_id
		);
		const nombreInstitucion =
			institucion && 'nombre_legal' in institucion
				? (institucion as any).nombre_legal
				: 'Institución';

		return {
			proyecto: {
				id_proyecto: project.id_proyecto,
				titulo: project.titulo,
				descripcion: project.descripcion,
				estado: project.estado,
				nombreInstitucion
			},
			proyectosDisponibles,
			tiposParticipacion: tiposUnicos,
			participacionesPermitidas: project.participacion_permitida || []
		};
	} catch (err) {
		console.error('Error loading evidencias page:', err);
		// Si es un error 404, lo re-lanzamos
		if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
			throw err;
		}
		// Para otros errores, retornamos datos vacíos en lugar de 500
		return {
			proyecto: {
				id_proyecto: 0,
				titulo: '',
				descripcion: '',
				estado: 'en_curso',
				nombreInstitucion: ''
			},
			proyectosDisponibles: [],
			tiposParticipacion: [],
			participacionesPermitidas: []
		};
	}
};
