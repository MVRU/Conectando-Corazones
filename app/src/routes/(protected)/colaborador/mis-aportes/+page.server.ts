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

	// Consultar evidencias de entrada del colaborador
	const evidencias = await prisma.evidencia.findMany({
		where: {
			tipo_evidencia: 'entrada',
			participacion_permitida: {
				proyecto: {
					colaboraciones: {
						some: {
							colaborador_id: id_usuario,
							estado: 'approved'
						}
					}
				}
			}
		},
		include: {
			archivos: true,
			participacion_permitida: {
				include: {
					tipo_participacion: true,
					proyecto: {
						select: {
							id_proyecto: true,
							titulo: true,
							estado: {
								select: {
									descripcion: true
								}
							}
						}
					}
				}
			}
		},
		orderBy: { created_at: 'desc' }
	});

	// Agrupar evidencias por proyecto
	const evidenciasPorProyecto = evidencias.reduce(
		(acc, evidencia) => {
			const proyecto = evidencia.participacion_permitida.proyecto;
			if (!proyecto) return acc;

			const proyectoId = proyecto.id_proyecto;

			if (!acc[proyectoId]) {
				acc[proyectoId] = {
					proyecto,
					evidencias: []
				};
			}

			acc[proyectoId].evidencias.push(evidencia);
			return acc;
		},
		{} as Record<number, any>
	);

	return JSON.parse(
		JSON.stringify({
			usuario,
			evidenciasPorProyecto: Object.values(evidenciasPorProyecto),
			totalEvidencias: evidencias.length
		})
	);
};
