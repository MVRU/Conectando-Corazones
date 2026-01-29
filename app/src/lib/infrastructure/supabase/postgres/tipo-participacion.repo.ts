import type { TipoParticipacionRepository } from '$lib/domain/repositories/TipoParticipacionRepository';
import type { TipoParticipacion } from '$lib/domain/entities/TipoParticipacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { TipoParticipacionMapper } from './mappers/tipo-participacion.mapper';

export class PostgresTipoParticipacionRepository implements TipoParticipacionRepository {
	async findAll(): Promise<TipoParticipacion[]> {
		const tipos = await prisma.tipoParticipacion.findMany();
		return tipos.map((t) => TipoParticipacionMapper.toDomain(t));
	}

	async findById(id: number): Promise<TipoParticipacion | null> {
		const tipo = await prisma.tipoParticipacion.findUnique({
			where: { id_tipo_participacion: id }
		});
		return tipo ? TipoParticipacionMapper.toDomain(tipo) : null;
	}
}
