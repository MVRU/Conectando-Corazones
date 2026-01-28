import type {
	UbicacionRepository,
	UbicacionUpdateData
} from '$lib/domain/repositories/UbicacionRepository';
import type { Ubicacion } from '$lib/domain/entities/Ubicacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { mapUbicacionToDomain } from './mappers/ubicacion.mapper';

export class UbicacionRepoPrisma implements UbicacionRepository {
	async findById(id: number): Promise<Ubicacion | null> {
		const data = await prisma.ubicacion.findUnique({
			where: { id_ubicacion: id },
			include: {
				localidad: {
					include: { provincia: true }
				}
			}
		});
		return data ? mapUbicacionToDomain(data) : null;
	}

	async update(id: number, data: UbicacionUpdateData): Promise<Ubicacion> {
		const ubicacion = await prisma.ubicacion.update({
			where: { id_ubicacion: id },
			data: {
				referencia: data.referencia,
				url_virtual: data.url_virtual
			},
			include: {
				localidad: {
					include: { provincia: true }
				}
			}
		});
		return mapUbicacionToDomain(ubicacion);
	}

	async getEstadosProyectosAsociados(id: number): Promise<string[]> {
		const pu = await prisma.proyectoUbicacion.findMany({
			where: { ubicacion_id: id },
			include: {
				proyecto: {
					select: {
						estado: {
							select: { descripcion: true }
						}
					}
				}
			}
		});
		return pu.map((item) => item.proyecto.estado?.descripcion).filter((d): d is string => !!d);
	}
}
