import { prisma } from '$lib/infrastructure/prisma/client';
import type { ConsentimientoRepository } from '$lib/domain/repositories/ConsentimientoRepository';
import type { Consentimiento } from '$lib/domain/types/Consentimiento';
import type { Consentimiento as PrismaConsentimiento } from '@prisma/client';

function toDomain(row: PrismaConsentimiento): Consentimiento {
	return {
		id_consentimiento: row.id_consentimiento,
		tipo: row.tipo as Consentimiento['tipo'],
		version: row.version,
		created_at: row.created_at ?? undefined,
		usuario_id: row.usuario_id ?? undefined
	};
}

export class PostgresConsentimientoRepository implements ConsentimientoRepository {
	async create(
		consentimiento: Consentimiento & { usuario_id: number },
		actorUserId: number
	): Promise<Consentimiento> {
		return prisma.$transaction(async (tx) => {
			const row = await tx.consentimiento.create({
				data: {
					tipo: consentimiento.tipo,
					version: consentimiento.version.trim(),
					usuario_id: consentimiento.usuario_id
				}
			});

			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'Consentimiento',
					id_objeto: row.id_consentimiento,
					accion: 'Crear',
					atributo_afectado: 'id_consentimiento',
					valor_anterior: 'null',
					valor_nuevo: String(row.id_consentimiento),
					justificacion: `Consentimiento registrado: ${row.tipo} v${row.version}`,
					usuario_id: actorUserId
				}
			});

			return toDomain(row);
		});
	}

	async findByUsuario(usuarioId: number): Promise<Consentimiento[]> {
		const rows = await prisma.consentimiento.findMany({
			where: { usuario_id: usuarioId },
			orderBy: { created_at: 'desc' }
		});
		return rows.map(toDomain);
	}

	async findByUsuarioTipoVersion(
		usuarioId: number,
		tipo: string,
		version: string
	): Promise<Consentimiento | null> {
		const row = await prisma.consentimiento.findFirst({
			where: {
				usuario_id: usuarioId,
				tipo,
				version: version.trim()
			}
		});
		return row ? toDomain(row) : null;
	}
}
