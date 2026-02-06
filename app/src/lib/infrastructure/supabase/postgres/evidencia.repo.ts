import { prisma } from '$lib/infrastructure/prisma/client';
import type { EvidenciaRepository } from '../../../domain/repositories/EvidenciaRepository';
import { Evidencia } from '../../../domain/entities/Evidencia';
import { Archivo } from '../../../domain/entities/Archivo';

export class PostgresEvidenciaRepository implements EvidenciaRepository {
	async create(evidencia: Evidencia): Promise<Evidencia> {
		if (!evidencia.archivos || evidencia.archivos.length === 0) {
			throw new Error('No se puede crear una evidencia sin archivos.');
		}

		// Usamos una transacción para asegurar que se guarde la evidencia y sus archivos
		const nuevaEvidencia = await prisma.$transaction(async (tx) => {
			const ev = await tx.evidencia.create({
				data: {
					tipo_evidencia: evidencia.tipo_evidencia,
					id_participacion_permitida: evidencia.id_participacion_permitida
				}
			});

			const usuarioId = evidencia.archivos[0].usuario_id;
			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Evidencia',
					id_objeto: ev.id_evidencia,
					accion: 'Crear',
					atributo_afectado: 'id_evidencia',
					valor_anterior: 'null',
					valor_nuevo: String(ev.id_evidencia),
					justificacion: `Nueva evidencia de ${ev.tipo_evidencia} creada`,
					usuario_id: usuarioId
				}
			});

			// Crear los archivos asociados
			const archivosCreados = [];
			for (const archivo of evidencia.archivos) {
				const nuevoArchivo = await tx.archivo.create({
					data: {
						nombre_original: archivo.nombre_original,
						url: archivo.url,
						descripcion: archivo.descripcion,
						tipo_mime: archivo.tipo_mime,
						tamanio_bytes: archivo.tamanio_bytes,
						usuario_id: archivo.usuario_id, // El usuario que subió el archivo
						evidencia_id: ev.id_evidencia, // Asociamos con la evidencia recién creada
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
						justificacion: `Archivo agregado a evidencia ${ev.id_evidencia}: ${nuevoArchivo.nombre_original}`,
						usuario_id: archivo.usuario_id
					}
				});

				archivosCreados.push(
					new Archivo({
						...nuevoArchivo,
						nombre_original: nuevoArchivo.nombre_original ?? undefined
					})
				);
			}

			// Retornamos la entidad de dominio completa
			return new Evidencia({
				id_evidencia: ev.id_evidencia,
				tipo_evidencia: ev.tipo_evidencia as 'entrada' | 'salida',
				created_at: ev.created_at,
				id_participacion_permitida: ev.id_participacion_permitida,
				archivos: archivosCreados
			});
		});

		return nuevaEvidencia;
	}

	async findByParticipacionAndTipo(
		idParticipacion: number,
		tipo: string
	): Promise<Evidencia | null> {
		const ev = await prisma.evidencia.findUnique({
			where: {
				id_participacion_permitida_tipo_evidencia: {
					id_participacion_permitida: idParticipacion,
					tipo_evidencia: tipo
				}
			},
			include: { archivos: true }
		});

		if (!ev) return null;

		return new Evidencia({
			id_evidencia: ev.id_evidencia,
			tipo_evidencia: ev.tipo_evidencia as 'entrada' | 'salida',
			created_at: ev.created_at,
			id_participacion_permitida: ev.id_participacion_permitida,
			archivos: ev.archivos.map(
				(a) => new Archivo({ ...a, nombre_original: a.nombre_original ?? undefined })
			)
		});
	}

	async addArchivos(idEvidencia: number, archivos: Archivo[]): Promise<Archivo[]> {
		const result = await prisma.$transaction(async (tx) => {
			const creados = [];
			for (const archivo of archivos) {
				const nuevoArchivo = await tx.archivo.create({
					data: {
						nombre_original: archivo.nombre_original,
						url: archivo.url,
						descripcion: archivo.descripcion,
						tipo_mime: archivo.tipo_mime,
						tamanio_bytes: archivo.tamanio_bytes,
						usuario_id: archivo.usuario_id,
						evidencia_id: idEvidencia,
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
						justificacion: `Archivo agregado a evidencia ${idEvidencia}: ${nuevoArchivo.nombre_original}`,
						usuario_id: archivo.usuario_id
					}
				});

				creados.push(
					new Archivo({
						...nuevoArchivo,
						nombre_original: nuevoArchivo.nombre_original ?? undefined
					})
				);
			}
			return creados;
		});
		return result;
	}

	async findAllByProyecto(proyectoId: number): Promise<Evidencia[]> {
		const evidencias = await prisma.evidencia.findMany({
			where: {
				participacion_permitida: {
					id_proyecto: proyectoId
				}
			},
			include: {
				archivos: true
			}
		});

		return evidencias.map(
			(e) =>
				new Evidencia({
					id_evidencia: e.id_evidencia,
					tipo_evidencia: e.tipo_evidencia as 'entrada' | 'salida',
					created_at: e.created_at,
					id_participacion_permitida: e.id_participacion_permitida,
					archivos: e.archivos.map(
						(a: any) =>
							new Archivo({
								id_archivo: a.id_archivo,
								nombre_original: a.nombre_original,
								url: a.url,
								descripcion: a.descripcion,
								tipo_mime: a.tipo_mime,
								tamanio_bytes: a.tamanio_bytes,
								created_at: a.created_at,
								usuario_id: a.usuario_id,
								evidencia_id: a.evidencia_id,
								proyecto_id: a.proyecto_id
							})
					)
				})
		);
	}
}
