import type { ProyectoCategoriaRepository } from '$lib/domain/repositories/ProyectoCategoriaRepository';
import type { ProyectoCategoria } from '$lib/domain/entities/ProyectoCategoria';
import { prisma } from '$lib/infrastructure/prisma/client';
import { mapProyectoCategoriasToDomain } from './mappers/proyecto-categoria.mapper';
import type { Prisma } from '@prisma/client';

export class ProyectoCategoriaRepoPrisma implements ProyectoCategoriaRepository {
	async findByProyectoId(proyectoId: number): Promise<ProyectoCategoria[]> {
		const data = await prisma.proyectoCategoria.findMany({
			where: { proyecto_id: proyectoId },
			include: { categoria: true }
		});
		return mapProyectoCategoriasToDomain(data);
	}

	async createMany(
		proyectoId: number,
		categoriaIds: number[],
		tx?: Prisma.TransactionClient
	): Promise<ProyectoCategoria[]> {
		const client = tx || prisma;

		await client.proyectoCategoria.createMany({
			data: categoriaIds.map((catId) => ({
				proyecto_id: proyectoId,
				categoria_id: catId
			})),
			skipDuplicates: true
		});

		// Retornam solo las categorías que se solicitaron crear
		const data = await client.proyectoCategoria.findMany({
			where: {
				proyecto_id: proyectoId,
				categoria_id: { in: categoriaIds }
			},
			include: { categoria: true }
		});

		return mapProyectoCategoriasToDomain(data);
	}
}
