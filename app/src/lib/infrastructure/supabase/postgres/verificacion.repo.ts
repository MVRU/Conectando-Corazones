import { prisma } from '$lib/infrastructure/prisma/client';
import type { VerificacionRepository } from '$lib/domain/repositories/VerificacionRepository';
import type { Verificacion } from '$lib/domain/types/Verificacion';
import type { Verificacion as PrismaVerificacion, Prisma } from '@prisma/client';

function toDomain(row: PrismaVerificacion): Verificacion {
	return {
		id_verificacion: row.id_verificacion,
		tipo: row.tipo,
		estado: row.estado as Verificacion['estado'],
		created_at: row.created_at ?? undefined,
		fecha_vencimiento: row.fecha_vencimiento ?? undefined,
		usuario_id: row.usuario_id ?? undefined
	};
}

async function recomputarEstadoVerificacionUsuario(tx: Prisma.TransactionClient, usuarioId: number) {
	const list = await tx.verificacion.findMany({ where: { usuario_id: usuarioId } });
	const hasAprobada = list.some((v) => v.estado === 'aprobada');
	const hasPendiente = list.some((v) => v.estado === 'pendiente');
	let ev: string | null = null;
	if (hasAprobada) ev = 'aprobada';
	else if (hasPendiente) ev = 'pendiente';
	else if (list.length > 0) ev = 'rechazada';

	await tx.usuario.update({
		where: { id_usuario: usuarioId },
		data: { estado_verificacion: ev }
	});
}

export class PostgresVerificacionRepository implements VerificacionRepository {
	async create(
		verificacion: Verificacion & { usuario_id: number },
		actorUserId: number
	): Promise<Verificacion> {
		return prisma.$transaction(async (tx) => {
			const row = await tx.verificacion.create({
				data: {
					tipo: verificacion.tipo,
					estado: verificacion.estado,
					usuario_id: verificacion.usuario_id,
					fecha_vencimiento: verificacion.fecha_vencimiento ?? null
				}
			});

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Verificacion',
					id_objeto: row.id_verificacion,
					accion: 'Crear',
					atributo_afectado: 'id_verificacion',
					valor_anterior: 'null',
					valor_nuevo: String(row.id_verificacion),
					justificacion: `Solicitud de verificación ${row.tipo} (${row.estado})`,
					usuario_id: actorUserId
				}
			});

			await recomputarEstadoVerificacionUsuario(tx, verificacion.usuario_id);

			return toDomain(row);
		});
	}

	async findById(id: number): Promise<Verificacion | null> {
		const row = await prisma.verificacion.findUnique({ where: { id_verificacion: id } });
		return row ? toDomain(row) : null;
	}

	async findByUsuario(usuarioId: number): Promise<Verificacion[]> {
		const rows = await prisma.verificacion.findMany({
			where: { usuario_id: usuarioId },
			orderBy: { created_at: 'desc' }
		});
		return rows.map(toDomain);
	}

	async findPendienteByUsuarioAndTipo(
		usuarioId: number,
		tipo: string
	): Promise<Verificacion | null> {
		const row = await prisma.verificacion.findFirst({
			where: {
				usuario_id: usuarioId,
				tipo,
				estado: 'pendiente'
			}
		});
		return row ? toDomain(row) : null;
	}

	async updateEstado(
		id: number,
		estado: string,
		context: { actorUserId: number; fecha_vencimiento?: Date | null }
	): Promise<Verificacion> {
		return prisma.$transaction(async (tx) => {
			const anterior = await tx.verificacion.findUnique({ where: { id_verificacion: id } });
			if (!anterior || !anterior.usuario_id) {
				throw new Error(`Verificación con id ${id} no encontrada.`);
			}

			const actualizado = await tx.verificacion.update({
				where: { id_verificacion: id },
				data: {
					estado,
					...(context.fecha_vencimiento !== undefined
						? { fecha_vencimiento: context.fecha_vencimiento }
						: {})
				}
			});

			if (anterior.estado !== estado) {
				await tx.historialDeCambios.create({
					data: {
						tipo_objeto: 'Verificacion',
						id_objeto: id,
						accion: 'Actualizar',
						atributo_afectado: 'estado',
						valor_anterior: anterior.estado,
						valor_nuevo: estado,
						justificacion: 'Resolución de verificación por administración',
						usuario_id: context.actorUserId
					}
				});
			}

			await recomputarEstadoVerificacionUsuario(tx, anterior.usuario_id);

			return toDomain(actualizado);
		});
	}
}
