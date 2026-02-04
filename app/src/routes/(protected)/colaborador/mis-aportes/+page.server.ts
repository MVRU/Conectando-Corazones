import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	if (usuario.rol !== 'colaborador') {
		throw redirect(303, '/mi-panel');
	}

	const id_usuario = usuario.id_usuario;

	// 1. Obtener todas las colaboraciones aprobadas del usuario con sus compromisos
	const colaboraciones = await prisma.colaboracion.findMany({
		where: {
			colaborador_id: id_usuario,
			estado: 'aprobada'
		},
		include: {
			proyecto: {
				include: {
					estado: true
				}
			},
			colaboraciones_tipo_participacion: {
				include: {
					participacion_permitida: {
						include: {
							tipo_participacion: true
						}
					}
				}
			}
		}
	});

	// 2. Obtener todas las evidencias de entrada subidas por el usuario
	const evidencias = await prisma.evidencia.findMany({
		where: {
			tipo_evidencia: 'entrada',
			archivos: {
				some: {
					usuario_id: id_usuario
				}
			}
		},
		include: {
			archivos: true,
			participacion_permitida: {
				include: {
					tipo_participacion: true,
					proyecto: {
						include: {
							estado: true
						}
					}
				}
			}
		},
		orderBy: { created_at: 'desc' }
	});

	// 3. Agrupar por proyecto
	const dataPorProyecto: Record<number, any> = {};

	// Procesar colaboraciones para asegurar que los proyectos aparezcan incluso sin evidencias aún
	colaboraciones.forEach((colab) => {
		const p = colab.proyecto;
		if (!p) return;

		if (!dataPorProyecto[p.id_proyecto]) {
			dataPorProyecto[p.id_proyecto] = {
				proyecto: p,
				compromisos: colab.colaboraciones_tipo_participacion,
				evidencias: []
			};
		} else {
			// Si ya existe (poco probable por la unicidad de colab), sumamos compromisos
			dataPorProyecto[p.id_proyecto].compromisos = [
				...dataPorProyecto[p.id_proyecto].compromisos,
				...colab.colaboraciones_tipo_participacion
			];
		}
	});

	// Agregar evidencias al proyecto correspondiente
	evidencias.forEach((evidencia) => {
		const p = evidencia.participacion_permitida.proyecto;
		if (!p) return;

		if (!dataPorProyecto[p.id_proyecto]) {
			dataPorProyecto[p.id_proyecto] = {
				proyecto: p,
				compromisos: [],
				evidencias: []
			};
		}
		dataPorProyecto[p.id_proyecto].evidencias.push(evidencia);
	});

	return JSON.parse(
		JSON.stringify({
			usuario,
			evidenciasPorProyecto: Object.values(dataPorProyecto),
			totalEvidencias: evidencias.length
		})
	);
};
