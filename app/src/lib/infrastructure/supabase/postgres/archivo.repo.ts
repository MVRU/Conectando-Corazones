import { prisma } from '$lib/infrastructure/prisma/client';
import type { ArchivoRepository } from '../../../domain/repositories/ArchivoRepository';
import { Archivo } from '../../../domain/entities/Archivo';

export class PostgresArchivoRepository implements ArchivoRepository {
	async create(archivo: Archivo): Promise<Archivo> {
		const nuevoArchivo = await prisma.archivo.create({
			data: {
				nombre_original: archivo.nombre_original,
				url: archivo.url,
				descripcion: archivo.descripcion,
				tipo_mime: archivo.tipo_mime,
				tamanio_bytes: archivo.tamanio_bytes,
				usuario_id: archivo.usuario_id,
				evidencia_id: archivo.evidencia_id,
				proyecto_id: archivo.proyecto_id
			}
		});

		return new Archivo({
			...nuevoArchivo,
			nombre_original: nuevoArchivo.nombre_original ?? undefined
		});
	}

	async update(id: number, data: Partial<Archivo>): Promise<Archivo> {
		const actualizado = await prisma.archivo.update({
			where: { id_archivo: id },
			data: {
				nombre_original: data.nombre_original,
				descripcion: data.descripcion,
				url: data.url
			}
		});
		return new Archivo({
			...actualizado,
			nombre_original: actualizado.nombre_original ?? undefined
		});
	}

	async delete(id: number): Promise<void> {
		await prisma.archivo.delete({
			where: { id_archivo: id }
		});
	}

	async findById(id: number): Promise<Archivo | null> {
		const archivo = await prisma.archivo.findUnique({
			where: { id_archivo: id }
		});

		if (!archivo) return null;
		return new Archivo({
			...archivo,
			nombre_original: archivo.nombre_original ?? undefined
		});
	}
}
