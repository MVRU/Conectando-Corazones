import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/entities/Resena';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ResenaMapper } from './mappers/resena.mapper';

export class PostgresResenaRepository implements ResenaRepository {
	async findById(id: number): Promise<Resena | null> {
		try {
			const resena = await prisma.resena.findUnique({ where: { id_resena: id } });
			return resena ? ResenaMapper.toDomain(resena) : null;
		} catch (error) {
			console.error('Error in PostgresResenaRepository.findById:', error);
			throw new Error('Error al buscar la reseña por ID');
		}
	}

	async findByObjeto(tipoObjeto: string, idObjeto: number): Promise<Resena[]> {
		try {
			const resenas = await prisma.resena.findMany({
				where: { tipo_objeto: tipoObjeto, id_objeto: idObjeto, aprobado: true },
				orderBy: { created_at: 'desc' },
				include: { autor: true }
			});
			return resenas.map(ResenaMapper.toDomain);
		} catch (error) {
			console.error('Error in PostgresResenaRepository.findByObjeto:', error);
			throw new Error('Error al buscar las reseñas del objeto');
		}
	}

	async findByAutor(autorId: number): Promise<Resena[]> {
		try {
			const resenas = await prisma.resena.findMany({
				where: { autor_id: autorId },
				orderBy: { created_at: 'desc' },
				include: { autor: true }
			});
			return resenas.map(ResenaMapper.toDomain);
		} catch (error) {
			console.error('Error in PostgresResenaRepository.findByAutor:', error);
			throw new Error('Error al buscar las reseñas del autor');
		}
	}

	async findByAutorAndObjeto(
		autorId: number,
		tipoObjeto: string,
		idObjeto: number
	): Promise<Resena | null> {
		try {
			const resena = await prisma.resena.findFirst({
				where: { autor_id: autorId, tipo_objeto: tipoObjeto, id_objeto: idObjeto }
			});
			return resena ? ResenaMapper.toDomain(resena) : null;
		} catch (error) {
			console.error('Error checking resena existence in DB:', error);
			throw new Error('Error al verificar la existencia de la reseña');
		}
	}

	async findAll(soloAprobadas: boolean = false): Promise<Resena[]> {
		try {
			const resenas = await prisma.resena.findMany({
				where: soloAprobadas ? { aprobado: true } : undefined,
				orderBy: { created_at: 'desc' },
				include: { autor: true }
			});
			return resenas.map(ResenaMapper.toDomain);
		} catch (error) {
			console.error('Error in PostgresResenaRepository.findAll:', error);
			throw new Error('Error al buscar todas las reseñas');
		}
	}

	async create(resena: Resena): Promise<Resena> {
		try {
			const data = ResenaMapper.toPrisma(resena);
			const created = await prisma.resena.create({ data });
			return ResenaMapper.toDomain(created);
		} catch (error) {
			console.error('Error creating resena in DB:', error);
			throw new Error('Error en BD al crear la reseña. Puede que los datos violen una restricción única.');
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await prisma.resena.delete({ where: { id_resena: id } });
		} catch (error) {
			console.error('Error in PostgresResenaRepository.delete:', error);
			throw new Error('Error en BD al intentar eliminar la resena.');
		}
	}

	// Métodos legados mantenidos por compatibilidad con perfil.adapter.ts y otras vistas
	async findByUsuario(usuarioId: number): Promise<Resena[]> {
		try {
			const resenas = await prisma.resena.findMany({
				where: { autor_id: usuarioId },
				orderBy: { created_at: 'desc' },
				include: { autor: true }
			});
			return resenas.map(ResenaMapper.toDomain);
		} catch (error) {
			console.error('Error in PostgresResenaRepository.findByUsuario:', error);
			throw new Error('Error al buscar las reseñas por usuario');
		}
	}

	async findByObjetoAprobadas(
		tipoObjeto: string,
		idObjeto: number,
		limite?: number
	): Promise<Resena[]> {
		try {
			const resenas = await prisma.resena.findMany({
				where: { tipo_objeto: tipoObjeto, id_objeto: idObjeto, aprobado: true },
				orderBy: { created_at: 'desc' },
				include: { autor: true },
				take: limite
			});
			return resenas.map(ResenaMapper.toDomain);
		} catch (error) {
			console.error('Error in PostgresResenaRepository.findByObjetoAprobadas:', error);
			throw new Error('Error al buscar las reseñas aprobadas del objeto');
		}
	}

	async save(resena: Resena): Promise<Resena> {
		return this.create(resena);
	}
}
