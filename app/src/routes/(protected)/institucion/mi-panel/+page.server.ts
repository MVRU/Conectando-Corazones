import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ProyectoMapper } from '$lib/infrastructure/supabase/postgres/mappers/proyecto.mapper';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	if (usuario.rol !== 'institucion') {
		throw redirect(303, '/mi-panel');
	}

	const id_usuario = usuario.id_usuario;

	// Datos para Institución
	const proyectos = await prisma.proyecto.findMany({
		where: { institucion_id: id_usuario },
		include: {
			estado: true,
			colaboraciones: true,
			participacion_permitida: {
				include: { tipo_participacion: true }
			},
			proyecto_categorias: {
				include: { categoria: true }
			},
			proyecto_ubicaciones: {
				include: { ubicacion: { include: { localidad: { include: { provincia: true } } } } }
			}
		},
		orderBy: { created_at: 'desc' }
	});

	const stats = {
		proyectosPublicados: proyectos.length,
		proyectosActivos: proyectos.filter((p) => p.estado?.descripcion === 'en_curso').length,
		totalRecaudado: 0,
		tasaExito: 0
	};

	const solicitudesPendientes = await prisma.colaboracion.count({
		where: {
			proyecto: { institucion_id: id_usuario },
			estado: 'pending'
		}
	});

	return JSON.parse(
		JSON.stringify({
			usuario,
			proyectos: proyectos
				.map((p) => {
					try {
						return ProyectoMapper.toDomain(p as any);
					} catch (err) {
						console.error(`Error al mapear proyecto ${p.id_proyecto} en panel institución:`, err);
						return null;
					}
				})
				.filter((p) => p !== null),
			stats,
			solicitudesPendientes
		})
	);
};
