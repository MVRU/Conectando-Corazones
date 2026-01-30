import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const projectId = Number(params.id);

		if (isNaN(projectId)) {
			throw error(404, 'Proyecto no encontrado');
		}

		const proyectoRepo = new PostgresProyectoRepository();
		const usuarioRepo = new PostgresUsuarioRepository();

		const project = await proyectoRepo.findById(projectId);

		if (!project) throw error(404, 'Proyecto no encontrado');

		// Extraer tipos de participación únicos permitidos para este proyecto
		const tiposUnicos = Array.from(
			new Set(project.participacion_permitida?.map((p) => p.tipo_participacion?.descripcion) || [])
		).filter(Boolean) as string[];

		// Obtener todos los proyectos disponibles (en curso o pendiente de cierre)
		// Usar findAllSummary() para reducir datos transferidos
		const allProjects = await proyectoRepo.findAllSummary();
		const proyectosDisponibles = allProjects
			.filter((p) => p.estado === 'en_curso' || p.estado === 'pendiente_solicitud_cierre')
			.map((p) => ({
				id_proyecto: p.id_proyecto,
				titulo: p.titulo,
				estado: p.estado
			}));

		// Obtener datos de la institución
		let nombreInstitucion = 'Institución';
		if (project.institucion_id) {
			const institucion = await usuarioRepo.findById(project.institucion_id);
			if (institucion && institucion.nombre_legal) {
				nombreInstitucion = institucion.nombre_legal;
			}
		}

		return {
			proyecto: JSON.parse(
				JSON.stringify({
					id_proyecto: project.id_proyecto,
					titulo: project.titulo,
					descripcion: project.descripcion,
					estado: project.estado,
					nombreInstitucion
				})
			),
			proyectosDisponibles: JSON.parse(JSON.stringify(proyectosDisponibles)),
			tiposParticipacion: tiposUnicos,
			participacionesPermitidas: JSON.parse(JSON.stringify(project.participacion_permitida || [])),
			evidencias: []
		};
	} catch (err) {
		console.error('Error loading evidencias page:', err);
		// Si es un error 404, lo re-lanzamos
		if (err && typeof err === 'object' && 'status' in err && (err as any).status === 404) {
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
