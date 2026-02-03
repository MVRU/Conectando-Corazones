import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ProyectoMapper } from '$lib/infrastructure/supabase/postgres/mappers/proyecto.mapper';

export const load: PageServerLoad = async ({ locals }) => {
	const usuario = locals.usuario;
	if (!usuario) {
		throw redirect(303, '/iniciar-sesion');
	}

	// Redirección para instituciones
	if (usuario.rol === 'institucion') {
		throw redirect(303, '/institucion/mi-panel');
	}

	const id_usuario = usuario.id_usuario;

	// Datos para Colaborador
	const colaboraciones = await prisma.colaboracion.findMany({
		where: { colaborador_id: id_usuario },
		include: {
			proyecto: {
				include: {
					estado: true,
					institucion: true,
					participacion_permitida: {
						include: { tipo_participacion: true }
					},
					proyecto_categorias: {
						include: { categoria: true }
					},
					proyecto_ubicaciones: {
						include: { ubicacion: { include: { localidad: { include: { provincia: true } } } } }
					}
				}
			}
		},
		orderBy: { created_at: 'desc' }
	});

	const stats = {
		proyectosParticipados: colaboraciones.length,
		proyectosCompletados: colaboraciones.filter(
			(c) => c.proyecto?.estado?.descripcion === 'finalizado'
		).length,
		puntosDImpacto: 0
	};

	return JSON.parse(
		JSON.stringify({
			usuario,
			colaboraciones: colaboraciones.map((c) => {
				let proyectoDomain = null;
				if (c.proyecto) {
					try {
						proyectoDomain = ProyectoMapper.toDomain(c.proyecto as any);
					} catch (err) {
						console.error(
							`Error al mapear proyecto ${c.proyecto.id_proyecto} en panel colaborador:`,
							err
						);
					}
				}
				return {
					...c,
					proyecto: proyectoDomain
				};
			}),
			stats
		})
	);
};
