import type { ParticipacionPermitidaRepository } from '$lib/domain/repositories/ParticipacionPermitidaRepository';
import type { ParticipacionPermitida } from '$lib/domain/entities/ParticipacionPermitida';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ParticipacionPermitidaMapper } from './mappers/participacion-permitida.mapper';

export class PostgresParticipacionPermitidaRepository implements ParticipacionPermitidaRepository {
	async findByProyectoId(proyectoId: number): Promise<ParticipacionPermitida[]> {
		const participaciones = await prisma.participacionPermitida.findMany({
			where: { id_proyecto: proyectoId },
			include: { tipo_participacion: true } // Para mapear descripcion
		});
		return participaciones.map((p) => ParticipacionPermitidaMapper.toDomain(p));
	}

	async create(participacion: ParticipacionPermitida): Promise<ParticipacionPermitida> {
		const created = await prisma.participacionPermitida.create({
			data: {
				id_proyecto: participacion.id_proyecto,
				id_tipo_participacion: participacion.id_tipo_participacion,
				objetivo: participacion.objetivo,
				actual: participacion.actual,
				unidad_medida: participacion.unidad_medida,
				especie: participacion.especie
			},
			include: { tipo_participacion: true }
		});
		return ParticipacionPermitidaMapper.toDomain(created);
	}

	async update(participacion: ParticipacionPermitida): Promise<ParticipacionPermitida> {
		if (!participacion.id_participacion_permitida) {
			throw new Error('No se puede actualizar una participación sin ID');
		}

		const updated = await prisma.participacionPermitida.update({
			where: { id_participacion_permitida: participacion.id_participacion_permitida },
			data: {
				objetivo: participacion.objetivo,
				actual: participacion.actual,
				unidad_medida: participacion.unidad_medida,
				especie: participacion.especie
			},
			include: { tipo_participacion: true }
		});
		return ParticipacionPermitidaMapper.toDomain(updated);
	}

	async delete(id: number): Promise<void> {
		await prisma.participacionPermitida.delete({
			where: { id_participacion_permitida: id }
		});
	}
}
