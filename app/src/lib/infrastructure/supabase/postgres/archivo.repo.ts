import { prisma } from '$lib/infrastructure/prisma/client';
import type { ArchivoRepository } from '../../../domain/repositories/ArchivoRepository';
import { Archivo } from '../../../domain/entities/Archivo';

export class PostgresArchivoRepository implements ArchivoRepository {
	async create(archivo: Archivo): Promise<Archivo> {
		return await prisma.$transaction(async (tx) => {
			const nuevoArchivo = await tx.archivo.create({
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

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Archivo',
					id_objeto: nuevoArchivo.id_archivo,
					accion: 'Crear',
					atributo_afectado: 'id_archivo',
					valor_anterior: 'null',
					valor_nuevo: String(nuevoArchivo.id_archivo),
					justificacion: `Archivo creado: ${nuevoArchivo.nombre_original}`,
					usuario_id: archivo.usuario_id
				}
			});

			return new Archivo({
				...nuevoArchivo,
				nombre_original: nuevoArchivo.nombre_original ?? undefined
			});
		});
	}

	async update(id: number, data: Partial<Archivo>, usuarioId: number): Promise<Archivo> {
		return await prisma.$transaction(async (tx) => {
			const anterior = await tx.archivo.findUnique({ where: { id_archivo: id } });
			if (!anterior) throw new Error(`Archivo con id ${id} no encontrado para actualizar.`);

			const actualizado = await tx.archivo.update({
				where: { id_archivo: id },
				data: {
					nombre_original: data.nombre_original,
					descripcion: data.descripcion,
					url: data.url
				}
			});

			const cambiosAregistrar = [];
			if (data.nombre_original !== undefined && data.nombre_original !== anterior.nombre_original) {
				cambiosAregistrar.push({
					campo: 'nombre_original',
					ant: anterior.nombre_original,
					nue: data.nombre_original
				});
			}
			if (data.descripcion !== undefined && data.descripcion !== anterior.descripcion) {
				cambiosAregistrar.push({
					campo: 'descripcion',
					ant: anterior.descripcion,
					nue: data.descripcion
				});
			}
			if (data.url !== undefined && data.url !== anterior.url) {
				cambiosAregistrar.push({ campo: 'url', ant: anterior.url, nue: data.url });
			}

			for (const cambio of cambiosAregistrar) {
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Archivo',
						id_objeto: id,
						accion: 'Actualizar',
						atributo_afectado: cambio.campo,
						valor_anterior: String(cambio.ant ?? ''),
						valor_nuevo: String(cambio.nue ?? ''),
						justificacion: 'Actualización de metadatos del archivo',
						usuario_id: usuarioId
					}
				});
			}

			return new Archivo({
				...actualizado,
				nombre_original: actualizado.nombre_original ?? undefined
			});
		});
	}

	async delete(id: number, usuarioId: number): Promise<void> {
		await prisma.$transaction(async (tx) => {
			const anterior = await tx.archivo.findUnique({ where: { id_archivo: id } });
			if (!anterior) throw new Error(`Archivo con id ${id} no encontrado para eliminar.`);

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Archivo',
					id_objeto: id,
					accion: 'Eliminar',
					atributo_afectado: 'id_archivo',
					valor_anterior: JSON.stringify({
						nombre: anterior.nombre_original,
						url: anterior.url
					}),
					valor_nuevo: 'Eliminado',
					justificacion: 'Archivo eliminado',
					usuario_id: usuarioId
				}
			});

			await tx.archivo.delete({
				where: { id_archivo: id }
			});
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
