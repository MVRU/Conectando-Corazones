import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MockSolicitudFinalizacionRepository } from '$lib/infrastructure/repositories/mock/MockSolicitudFinalizacionRepository';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';
import { MockColaboracionRepository } from '$lib/infrastructure/repositories/mock/MockColaboracionRepository';
import { mockEvidencias } from '$lib/infrastructure/mocks/mock-evidencias';

// Repositories
const solicitudRepo = new MockSolicitudFinalizacionRepository();
const proyectoRepo = new MockProyectoRepository();
const colaboracionRepo = new MockColaboracionRepository();

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.usuario;
	if (!user || user.rol !== 'colaborador') {
		throw redirect(303, '/login');
	}

	const proyectoId = Number(params.id);

	// 1. Verificar que el colaborador tenga una colaboración APROBADA en este proyecto
	const colaboraciones = await colaboracionRepo.findByProyectoId(proyectoId);
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

	// 3. Buscar la solicitud PENDIENTE
	const solicitud = await solicitudRepo.findByProyectoId(proyectoId);

	let solicitudConEvidencias = null;
	if (solicitud) {
		const evidencias = mockEvidencias.filter(
			(e) => e.id_evidencia && solicitud.evidencia_ids.includes(e.id_evidencia)
		);
		solicitudConEvidencias = { ...solicitud, evidencias };
	}

	return {
		proyecto,
		solicitud: solicitudConEvidencias,
		isEnRevision: proyecto.estado === 'en_revision'
	};
};

export const actions: Actions = {
	aprobar: async ({ request, params }) => {
		const formData = await request.formData();
		const solicitudId = Number(formData.get('solicitud_id'));
		const proyectoId = Number(params.id);

		if (!solicitudId) {
			return fail(400, { error: 'Solicitud ID es requerido' });
		}

		try {
			// 1. Actualizar solicitud a aprobada
			await solicitudRepo.updateEstado(solicitudId, 'aprobada');

			// 2. Actualizar proyecto a finalizado
			await proyectoRepo.update(proyectoId, {
				// @ts-ignore: Mock permite string en estado aunque tipado diga objeto/id a veces en runtime
				estado: 'finalizado'
			});

			return { success: true, message: 'El proyecto ha sido cerrado exitosamente.' };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Error al aprobar la solicitud' });
		}
	},

	rechazar: async ({ request, params }) => {
		const formData = await request.formData();
		const solicitudId = Number(formData.get('solicitud_id'));
		const proyectoId = Number(params.id);
		const motivo = formData.get('motivo') as string;

		if (!solicitudId) {
			return fail(400, { error: 'Solicitud ID es requerido' });
		}

		try {
			// 1. Actualizar solicitud a rechazada
			await solicitudRepo.updateEstado(solicitudId, 'rechazada', motivo);

			// 2. Verificar conteo de rechazos
			const count = await solicitudRepo.countRechazadasByProyectoId(proyectoId);

			if (count >= 3) {
				// Pasar a auditoría
				await proyectoRepo.update(proyectoId, {
					// @ts-ignore
					estado: 'en_auditoria'
				});
			} else {
				await proyectoRepo.update(proyectoId, {
					// @ts-ignore
					estado: 'pendiente_solicitud_cierre'
				});
			}

			return { success: true, message: 'Solicitud rechazada correctamente.' };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Error al rechazar la solicitud' });
		}
	}
};
