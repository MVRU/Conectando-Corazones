import type { ParticipacionPermitidaRepository } from '$lib/domain/repositories/ParticipacionPermitidaRepository';
import type { ParticipacionPermitida } from '$lib/domain/entities/ParticipacionPermitida';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ParticipacionPermitidaMapper } from './mappers/participacion-permitida.mapper';

export class PostgresParticipacionPermitidaRepository implements ParticipacionPermitidaRepository {
	async findAllByProyecto(id_proyecto: number): Promise<ParticipacionPermitida[]> {
		const participaciones = await prisma.participacionPermitida.findMany({
			where: { id_proyecto },
			include: { tipo_participacion: true }
		});
		return participaciones.map((p) => ParticipacionPermitidaMapper.toDomain(p));
	}

	async findById(id: number): Promise<ParticipacionPermitida | null> {
		const participacion = await prisma.participacionPermitida.findUnique({
			where: { id_participacion_permitida: id },
			include: { tipo_participacion: true }
		});
		if (!participacion) return null;
		return ParticipacionPermitidaMapper.toDomain(participacion);
	}

	async save(participacion: ParticipacionPermitida): Promise<ParticipacionPermitida> {
		const data = ParticipacionPermitidaMapper.toPrisma(participacion);

		if (participacion.id_participacion_permitida) {
			const updated = await prisma.participacionPermitida.update({
				where: { id_participacion_permitida: participacion.id_participacion_permitida },
				data,
				include: { tipo_participacion: true }
			});
			return ParticipacionPermitidaMapper.toDomain(updated);
		}

		const created = await prisma.participacionPermitida.create({
			data,
			include: { tipo_participacion: true }
		});
		return ParticipacionPermitidaMapper.toDomain(created);
	}

	async delete(id: number): Promise<void> {
		await prisma.participacionPermitida.delete({
			where: { id_participacion_permitida: id }
		});
	}
}
