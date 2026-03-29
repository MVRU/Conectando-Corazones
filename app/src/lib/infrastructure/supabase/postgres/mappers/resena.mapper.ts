import type { Resena as PrismaResena } from '@prisma/client';
import { Resena } from '$lib/domain/entities/Resena';
import type { TipoObjetoResena } from '$lib/domain/types/Resena';

export class ResenaMapper {
	static toDomain(prismaResena: any): Resena {
		return new Resena({
			id_resena: prismaResena.id_resena,
			tipo_objeto: (prismaResena.tipo_objeto as TipoObjetoResena) ?? undefined,
			id_objeto: prismaResena.id_objeto ?? undefined,
			contenido: prismaResena.contenido,
			puntaje: prismaResena.puntaje,
			aprobado: prismaResena.aprobado,
			rol: prismaResena.rol ?? undefined,
			username: prismaResena.username ?? undefined,
			autor_id: prismaResena.autor_id ?? undefined,
			created_at: prismaResena.created_at ?? undefined,
			autor: prismaResena.autor ?? undefined
		});
	}

	static toPrisma(resena: Resena): Omit<PrismaResena, 'id_resena'> {
		return {
			tipo_objeto: resena.tipo_objeto ?? null,
			id_objeto: resena.id_objeto ?? null,
			contenido: resena.contenido,
			puntaje: resena.puntaje,
			aprobado: resena.aprobado ?? null,
			rol: resena.rol ?? null,
			username: resena.username ?? null,
			autor_id: resena.autor_id ?? null,
			created_at: resena.created_at ?? new Date()
		};
	}
}
