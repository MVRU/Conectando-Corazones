import { ProyectoCategoria } from '$lib/domain/entities/ProyectoCategoria';
import type { ProyectoCategoria as PrismaPC, Categoria as PrismaCat } from '@prisma/client';

type PrismaProyectoCategoriaWithRelations = PrismaPC & {
    categoria?: PrismaCat;
};

export function mapProyectoCategoriaToDomain(
    data: PrismaProyectoCategoriaWithRelations
): ProyectoCategoria {
    return new ProyectoCategoria({
        id_proyecto_categoria: data.id_proyecto_categoria,
        categoria_id: data.categoria_id,
        proyecto_id: data.proyecto_id,
        categoria: data.categoria ? {
            id_categoria: data.categoria.id_categoria,
            descripcion: data.categoria.descripcion
        } : undefined
    });
}

export function mapProyectoCategoriasToDomain(
    dataArray: PrismaProyectoCategoriaWithRelations[]
): ProyectoCategoria[] {
    return dataArray.map(mapProyectoCategoriaToDomain);
}
