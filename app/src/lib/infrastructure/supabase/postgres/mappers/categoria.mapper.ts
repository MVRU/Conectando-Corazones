import type { Categoria as PrismaCategoria } from '@prisma/client';
import { Categoria } from '$lib/domain/entities/Categoria';

export class CategoriaMapper {
	static toDomain(prismaCategoria: PrismaCategoria): Categoria {
		return new Categoria({
			id_categoria: prismaCategoria.id_categoria,
			descripcion: prismaCategoria.descripcion
		});
	}
}
