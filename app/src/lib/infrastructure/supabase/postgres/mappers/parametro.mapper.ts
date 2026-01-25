import type { Parametro as PrismaParametro } from '@prisma/client';
import { Parametro, type TipoParametro } from '$lib/domain/entities/Parametro';

export function mapParametroToDomain(prismaData: PrismaParametro): Parametro {
    return new Parametro({
        id_parametro: prismaData.id_parametro,
        nombre: prismaData.nombre,
        valor: prismaData.valor,
        tipo: prismaData.tipo as TipoParametro,
        descripcion: prismaData.descripcion
    });
}
