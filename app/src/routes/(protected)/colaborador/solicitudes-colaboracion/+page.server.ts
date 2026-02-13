import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;

	if (!usuario || !usuario.id_usuario) {
		throw redirect(303, '/login');
	}

	const colaboraciones = await prisma.colaboracion.findMany({
		where: {
			colaborador_id: usuario.id_usuario
		},
		include: {
			proyecto: {
				include: {
					institucion: true
				}
			}
		},
		orderBy: {
			created_at: 'desc'
		}
	});

	// Mapeamos los datos para asegurar que coincidan con lo que espera el frontend
	// Especialmente transformando los IDs a lo que la vista espera si es necesario
	const colaboracionesMapped = colaboraciones
		.filter((c) => c.proyecto)
		.map((c) => ({
			id_colaboracion: c.id_colaboracion,
			estado: c.estado as 'pendiente' | 'aprobada' | 'rechazada' | 'anulada',
			created_at: c.created_at || new Date(),
			mensaje: c.mensaje,
			justificacion: c.justificacion,
			proyecto: {
				id: c.proyecto!.id_proyecto,
				titulo: c.proyecto!.titulo,
				url_portada: c.proyecto!.url_portada || '/images/placeholder-project.jpg', // Placeholder si no hay imagen
				institucion: {
					nombre_legal:
						c.proyecto!.institucion.nombre_legal ||
						c.proyecto!.institucion.nombre ||
						'Institución desconocida'
				}
			}
		}));

	return {
		colaboraciones: colaboracionesMapped
	};
};
