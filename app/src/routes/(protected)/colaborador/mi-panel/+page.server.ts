import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ProyectoMapper } from '$lib/infrastructure/supabase/postgres/mappers/proyecto.mapper';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	if (usuario.rol !== 'colaborador') {
		throw redirect(303, '/mi-panel');
	}

	const id_usuario = usuario.id_usuario;

	// Consultar proyectos donde el usuario es colaborador aprobado
	const proyectos = await prisma.proyecto.findMany({
		where: {
			colaboraciones: {
				some: {
					colaborador_id: id_usuario,
					estado: 'approved'
				}
			}
		},
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

	// Contar evidencias de entrada del colaborador
	const aportesRealizados = await prisma.evidencia.count({
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
		}
	});

	// Consultar evaluaciones pendientes
	const evaluacionesPendientes = await prisma.solicitudFinalizacion.count({
		where: {
			estado: 'pendiente',
			proyecto: {
				colaboraciones: {
					some: {
						colaborador_id: id_usuario,
						estado: 'approved'
					}
				}
			},
			evaluaciones: {
				none: {
					colaborador_id: id_usuario
				}
			}
		}
	});

	const stats = {
		proyectosColaborando: proyectos.length,
		aportesRealizados,
		evaluacionesPendientes
	};

	return JSON.parse(
		JSON.stringify({
			usuario,
			proyectos: proyectos
				.map((p) => {
					try {
						return ProyectoMapper.toDomain(p as any);
					} catch (err) {
						console.error(`Error al mapear proyecto ${p.id_proyecto} en panel colaborador:`, err);
						return null;
					}
				})
				.filter((p) => p !== null),
			stats
		})
	);
};
