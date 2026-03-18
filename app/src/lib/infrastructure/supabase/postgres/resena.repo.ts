import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/types/Resena';
import { prisma } from '$lib/infrastructure/prisma/client';

export class PostgresResenaRepository implements ResenaRepository {
	async findByUsuario(usuarioId: number): Promise<Resena[]> {
		const resenas = await prisma.resena.findMany({
			where: {
				username: usuarioId.toString()
			},
			orderBy: {
				id_resena: 'desc'
			}
		});

		return resenas as Resena[];
	}

	async findByObjetoAprobadas(
		tipoObjeto: string,
		idObjeto: number,
		limite?: number
	): Promise<Resena[]> {
		const resenas = await prisma.resena.findMany({
			where: {
				tipo_objeto: tipoObjeto,
				id_objeto: idObjeto,
				aprobado: true
			},
			orderBy: {
				id_resena: 'desc'
			},
			take: limite
		});

		return resenas as Resena[];
	}

	async save(resena: Resena): Promise<Resena> {
		const created = await prisma.resena.create({
			data: {
				tipo_objeto: resena.tipo_objeto,
				id_objeto: resena.id_objeto,
				contenido: resena.contenido,
				puntaje: resena.puntaje,
				aprobado: resena.aprobado,
				rol: resena.rol,
				username: resena.username
			}
		});

		return created as Resena;
	}

	async findAll(): Promise<Resena[]> {
		const resenas = await prisma.resena.findMany({
			orderBy: {
				id_resena: 'desc'
			}
		});

		return resenas as Resena[];
	}
}
