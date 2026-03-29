import { prisma } from '$lib/infrastructure/prisma/client';
import type { ContactoRepository } from '$lib/domain/repositories/ContactoRepository';
import { Contacto } from '$lib/domain/entities/Contacto';
import type { Contacto as PrismaContacto } from '@prisma/client';

function toDomain(row: PrismaContacto): Contacto {
	return new Contacto({
		id_contacto: row.id_contacto,
		tipo_contacto: row.tipo_contacto,
		valor: row.valor,
		etiqueta: row.etiqueta,
		usuario_id: row.usuario_id
	});
}

export class PostgresContactoRepository implements ContactoRepository {
	async findByUsuario(usuarioId: number): Promise<Contacto[]> {
		const rows = await prisma.contacto.findMany({
			where: { usuario_id: usuarioId },
			orderBy: { id_contacto: 'asc' }
		});
		return rows.map(toDomain);
	}

	async findById(id: number): Promise<Contacto | null> {
		const row = await prisma.contacto.findUnique({ where: { id_contacto: id } });
		if (!row) return null;
		return toDomain(row);
	}

	async createManyForUsuario(
		usuarioId: number,
		contactos: Contacto[],
		actorUserId: number
	): Promise<Contacto[]> {
		return prisma.$transaction(async (tx) => {
			const created: Contacto[] = [];
			for (const c of contactos) {
				const row = await tx.contacto.create({
					data: {
						tipo_contacto: c.tipo_contacto,
						valor: c.valor.trim(),
						etiqueta: c.etiqueta ?? null,
						usuario_id: usuarioId
					}
				});
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Contacto',
						id_objeto: row.id_contacto,
						accion: 'Crear',
						atributo_afectado: 'id_contacto',
						valor_anterior: 'null',
						valor_nuevo: String(row.id_contacto),
						justificacion: `Contacto creado (${row.tipo_contacto})`,
						usuario_id: actorUserId
					}
				});
				created.push(toDomain(row));
			}
			return created;
		});
	}

	async replaceAllForUsuario(
		usuarioId: number,
		contactos: Contacto[],
		actorUserId: number
	): Promise<Contacto[]> {
		return prisma.$transaction(async (tx) => {
			const existing = await tx.contacto.findMany({ where: { usuario_id: usuarioId } });
			for (const e of existing) {
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Contacto',
						id_objeto: e.id_contacto,
						accion: 'Eliminar',
						atributo_afectado: 'contacto',
						valor_anterior: JSON.stringify({
							tipo: e.tipo_contacto,
							valor: e.valor
						}),
						valor_nuevo: 'Eliminado',
						justificacion: 'Sincronización de contactos del perfil',
						usuario_id: actorUserId
					}
				});
			}
			await tx.contacto.deleteMany({ where: { usuario_id: usuarioId } });

			const created: Contacto[] = [];
			for (const c of contactos) {
				const row = await tx.contacto.create({
					data: {
						tipo_contacto: c.tipo_contacto,
						valor: c.valor.trim(),
						etiqueta: c.etiqueta ?? null,
						usuario_id: usuarioId
					}
				});
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Contacto',
						id_objeto: row.id_contacto,
						accion: 'Crear',
						atributo_afectado: 'id_contacto',
						valor_anterior: 'null',
						valor_nuevo: String(row.id_contacto),
						justificacion: `Contacto creado en sincronización (${row.tipo_contacto})`,
						usuario_id: actorUserId
					}
				});
				created.push(toDomain(row));
			}
			return created;
		});
	}

	async update(
		id: number,
		data: Partial<Pick<Contacto, 'tipo_contacto' | 'valor' | 'etiqueta'>>,
		actorUserId: number
	): Promise<Contacto> {
		return prisma.$transaction(async (tx) => {
			const anterior = await tx.contacto.findUnique({ where: { id_contacto: id } });
			if (!anterior) throw new Error(`Contacto con id ${id} no encontrado.`);

			const dataPatch: { tipo_contacto?: string; valor?: string; etiqueta?: string | null } = {};
			if (data.tipo_contacto !== undefined) dataPatch.tipo_contacto = data.tipo_contacto;
			if (data.valor !== undefined) dataPatch.valor = data.valor.trim();
			if (data.etiqueta !== undefined) dataPatch.etiqueta = data.etiqueta;

			const actualizado = await tx.contacto.update({
				where: { id_contacto: id },
				data: dataPatch
			});

			const cambios: { campo: string; ant: string | null; nue: string | null }[] = [];
			if (data.tipo_contacto !== undefined && data.tipo_contacto !== anterior.tipo_contacto) {
				cambios.push({
					campo: 'tipo_contacto',
					ant: anterior.tipo_contacto,
					nue: data.tipo_contacto
				});
			}
			if (data.valor !== undefined && data.valor.trim() !== anterior.valor) {
				cambios.push({ campo: 'valor', ant: anterior.valor, nue: data.valor.trim() });
			}
			if (data.etiqueta !== undefined && data.etiqueta !== anterior.etiqueta) {
				cambios.push({
					campo: 'etiqueta',
					ant: anterior.etiqueta,
					nue: data.etiqueta
				});
			}

			for (const c of cambios) {
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Contacto',
						id_objeto: id,
						accion: 'Actualizar',
						atributo_afectado: c.campo,
						valor_anterior: String(c.ant ?? ''),
						valor_nuevo: String(c.nue ?? ''),
						justificacion: 'Actualización de contacto',
						usuario_id: actorUserId
					}
				});
			}

			return toDomain(actualizado);
		});
	}

	async delete(id: number, actorUserId: number): Promise<void> {
		await prisma.$transaction(async (tx) => {
			const anterior = await tx.contacto.findUnique({ where: { id_contacto: id } });
			if (!anterior) throw new Error(`Contacto con id ${id} no encontrado.`);

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Contacto',
					id_objeto: id,
					accion: 'Eliminar',
					atributo_afectado: 'contacto',
					valor_anterior: JSON.stringify({
						tipo: anterior.tipo_contacto,
						valor: anterior.valor
					}),
					valor_nuevo: 'Eliminado',
					justificacion: 'Eliminación de contacto',
					usuario_id: actorUserId
				}
			});

			await tx.contacto.delete({ where: { id_contacto: id } });
		});
	}
}
