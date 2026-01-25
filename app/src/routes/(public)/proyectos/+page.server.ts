import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { GetAllProvincias } from '$lib/domain/use-cases/ubicacion/GetAllProvincias';
import { ProvinciaRepoPrisma } from '$lib/infrastructure/supabase/postgres/provincia.repo';
import { MockProyectoRepository } from '$lib/infrastructure/repositories/mock/MockProyectoRepository';

export const load: PageServerLoad = async () => {
	try {
		const provinciaRepo = new ProvinciaRepoPrisma();
		const getAllProvincias = new GetAllProvincias(provinciaRepo);
		const provincias = await getAllProvincias.execute();

		// TODO: cambiar a DB cuando esté listo
		/*
		const proyectos = await prisma.proyecto.findMany({
			where: {
				NOT: {
					estado: 'cancelado' // Optionally filter out cancelled, or keep them
				}
			},
			include: {
				institucion: true,
				proyecto_categorias: {
					include: {
						categoria: true
					}
				},
				proyecto_ubicaciones: {
					include: {
						ubicacion: {
							include: {
								localidad: {
									include: {
										provincia: true
									}
								}
							}
						}
					}
				},
				participacion_permitida: {
					include: {
						tipo_participacion: true
					}
				}
			},
			orderBy: { created_at: 'desc' }
		});

		// Transform projects to match the expected frontend type
		const proyectosTransformados = (proyectos as any[]).map((p) => ({
			...p,
			categorias: p.proyecto_categorias?.map((pc: any) => pc.categoria) || [],
			ubicaciones: p.proyecto_ubicaciones || [],
			institucion_id: p.institucion_id,
			estado: p.estado as EstadoDescripcion
		})) as unknown as Proyecto[];
		*/

		const proyectoRepo = new MockProyectoRepository();
		const proyectos = await proyectoRepo.findAll();

		return {
			proyectos,
			provincias: provincias.map((p) => p.nombre)
		};
	} catch (e) {
		console.error('Error loading projects:', e);
		throw error(500, 'Error al cargar los proyectos');
	}
};
