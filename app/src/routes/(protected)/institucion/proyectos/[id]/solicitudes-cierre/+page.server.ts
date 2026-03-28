import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { prisma } from '$lib/infrastructure/prisma/client';

export const load: PageServerLoad = async ({ params, locals }) => {
	const user = locals.usuario;
	if (!user) throw redirect(302, '/login');
	if (user.rol !== 'institucion') throw redirect(302, '/');

	const proyectoId = Number(params.id);
	if (Number.isNaN(proyectoId)) throw error(404, 'Proyecto no encontrado');

	const proyectoRepo = new PostgresProyectoRepository();
	const proyecto = await proyectoRepo.findById(proyectoId);
	if (!proyecto) throw error(404, 'Proyecto no encontrado');
	if (proyecto.institucion_id !== user.id_usuario) throw error(403, 'No autorizado');

	const solicitudes = await prisma.solicitudFinalizacion.findMany({
		where: { proyecto_id: proyectoId },
		orderBy: { created_at: 'desc' },
		include: {
			evaluaciones: {
				include: {
					colaborador: {
						select: {
							id_usuario: true,
							username: true,
							nombre: true,
							apellido: true
						}
					}
				},
				orderBy: { created_at: 'asc' }
			}
		}
	});

	return {
		proyecto: JSON.parse(JSON.stringify(proyecto)),
		solicitudes: JSON.parse(JSON.stringify(solicitudes))
	};
};
