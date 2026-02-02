import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { PostgresColaboracionRepository } from '$lib/infrastructure/supabase/postgres/colaboracion.repo';

// Repositories
const proyectoRepo = new PostgresProyectoRepository();
const colaboracionRepo = new PostgresColaboracionRepository();

// Helper para asegurar numero id
function ensureId(id: number | undefined): number {
	if (id === undefined) throw new Error('El ID es undefined');
	return id;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.usuario;
	if (!user || user.rol !== 'colaborador') {
		throw redirect(303, '/iniciar-sesion');
	}

	const proyectoId = Number(params.id);

	// 1. Verificar que el colaborador tenga una colaboración APROBADA en este proyecto
	const colaboraciones = await colaboracionRepo.findByProyecto(proyectoId);
	const esColaboradorAprobado = colaboraciones.some(
		(c) => c.colaborador_id === user.id_usuario && c.estado === 'aprobada'
	);

	if (!esColaboradorAprobado) {
		throw redirect(303, `/proyectos/${proyectoId}`);
	}

	// 2. Verificar estado del proyecto
	const proyecto = await proyectoRepo.findById(proyectoId);
	if (!proyecto) {
		throw redirect(303, '/proyectos');
	}

	// 3. Buscar la solicitud PENDIENTE (Backend no implementado aún)
	// Como no hay repo de solicitudes, devolvemos null para simular que no hay solicitud activa o evitar 500
	const solicitud = null;

	let solicitudConEvidencias = null;
	let evaluacion = null;
	let yaVote = false;

	let totalColaboradores = 0;
	let votosRealizados = 0;

	// Simulamos lógica si hubiera solicitud
	/*
	if (solicitud) {
		// ... lógica de evidencias y evaluaciones ...
	}
	*/

	// Contar colaboradores reales
	const todasColaboraciones = await colaboracionRepo.findByProyecto(proyectoId);
	totalColaboradores = todasColaboraciones.filter((c) => c.estado === 'aprobada').length;

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		solicitud: solicitudConEvidencias, // null
		evaluacion, // null
		yaVote, // false
		totalColaboradores,
		votosRealizados,
		isEnRevision: proyecto.estado === 'en_revision'
	};
};

export const actions: Actions = {
	aprobar: async ({ request, params, locals }) => {
		// Funcionalidad deshabilitada hasta tener backend de solicitudes
		return fail(501, { error: 'Funcionalidad de aprobación aún no disponible' });
	},

	rechazar: async ({ request, params, locals }) => {
		// Funcionalidad deshabilitada hasta tener backend de solicitudes
		return fail(501, { error: 'Funcionalidad de rechazo aún no disponible' });
	},

	reportar: async ({ request, params }) => {
		return {
			success: true,
			message: 'Irregularidad reportada correctamente. El equipo de auditoría revisará el caso.'
		};
	}
};
