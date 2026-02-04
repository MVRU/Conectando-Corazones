import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ColaboracionMapper } from './mappers/colaboracion.mapper';

export class PostgresColaboracionRepository implements ColaboracionRepository {
	private includeOptions = {
		colaborador: {
			include: {
				localidad: { include: { provincia: true } }
			}
		},
		colaboraciones_tipo_participacion: {
			include: {
				participacion_permitida: {
					include: { tipo_participacion: true }
				}
			}
		}
	};

	async findById(id: number): Promise<Colaboracion | null> {
		try {
			const colaboracion = await prisma.colaboracion.findUnique({
				where: { id_colaboracion: id },
				include: this.includeOptions
			});

			return colaboracion ? ColaboracionMapper.toDomain(colaboracion as any) : null;
		} catch (error) {
			console.error('Error finding colaboracion by id:', error);
			return null;
		}
	}

	async findByProyecto(proyectoId: number): Promise<Colaboracion[]> {
		try {
			const colaboraciones = await prisma.colaboracion.findMany({
				where: { proyecto_id: proyectoId },
				include: this.includeOptions,
				orderBy: { created_at: 'desc' }
			});

			return colaboraciones.map((c) => ColaboracionMapper.toDomain(c as any));
		} catch (error) {
			console.error('Error finding colaboraciones by proyecto:', error);
			return [];
		}
	}

	async findByColaborador(colaboradorId: number): Promise<Colaboracion[]> {
		try {
			const colaboraciones = await prisma.colaboracion.findMany({
				where: { colaborador_id: colaboradorId },
				include: this.includeOptions,
				orderBy: { created_at: 'desc' }
			});

			return colaboraciones.map((c) => ColaboracionMapper.toDomain(c as any));
		} catch (error) {
			console.error('Error finding colaboraciones by colaborador:', error);
			return [];
		}
	}

	async findByProyectoAndColaborador(
		proyectoId: number,
		colaboradorId: number
	): Promise<Colaboracion | null> {
		try {
			const colaboracion = await prisma.colaboracion.findFirst({
				where: {
					proyecto_id: proyectoId,
					colaborador_id: colaboradorId
				},
				include: this.includeOptions
			});

			return colaboracion ? ColaboracionMapper.toDomain(colaboracion as any) : null;
		} catch (error) {
			console.error('Error finding colaboracion by proyecto and colaborador:', error);
			return null;
		}
	}

	async create(colaboracion: Colaboracion): Promise<Colaboracion> {
		try {
			const data = ColaboracionMapper.toPrisma(colaboracion);

			const created = await prisma.colaboracion.create({
				data,
				include: this.includeOptions
			});

			return ColaboracionMapper.toDomain(created as any);
		} catch (error) {
			console.error('Error creating colaboracion:', error);
			throw new Error('Error al crear la colaboración');
		}
	}

	async update(id: number, colaboracion: Partial<Colaboracion>): Promise<Colaboracion> {
		try {
			const updateData: any = {};

			if (colaboracion.estado) updateData.estado = colaboracion.estado;
			if (colaboracion.justificacion !== undefined)
				updateData.justificacion = colaboracion.justificacion;
			if (colaboracion.mensaje !== undefined) updateData.mensaje = colaboracion.mensaje;

			const updated = await prisma.colaboracion.update({
				where: { id_colaboracion: id },
				data: updateData,
				include: this.includeOptions
			});

			return ColaboracionMapper.toDomain(updated as any);
		} catch (error) {
			console.error('Error updating colaboracion:', error);
			throw new Error('Error al actualizar la colaboración');
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await prisma.colaboracion.delete({
				where: { id_colaboracion: id }
			});
		} catch (error) {
			console.error('Error deleting colaboracion:', error);
			throw new Error('Error al eliminar la colaboración');
		}
	}

	// Métodos legacy para compatibilidad
	async getColaboracion(proyectoId: number, usuarioId: number): Promise<Colaboracion | null> {
		return this.findByProyectoAndColaborador(proyectoId, usuarioId);
	}

	async getAportesPorColaboracion(colaboracionId: number): Promise<any[]> {
		try {
			const aportes = await prisma.colaboracionTipoParticipacion.findMany({
				where: { colaboracion_id: colaboracionId },
				include: {
					participacion_permitida: {
						include: { tipo_participacion: true }
					}
				}
			});
			return aportes;
		} catch (error) {
			console.error('Error getting aportes:', error);
			return [];
		}
	}

	async getEvidencias(participacionPermitidaId: number): Promise<any[]> {
		try {
			const evidencias = await prisma.evidencia.findMany({
				where: { id_participacion_permitida: participacionPermitidaId },
				include: {
					archivos: true
				}
			});
			return evidencias;
		} catch (error) {
			console.error('Error getting evidencias:', error);
			return [];
		}
	}

	async getColaboracionesPorProyecto(proyectoId: number): Promise<Colaboracion[]> {
		try {
			const colaboraciones = await prisma.colaboracion.findMany({
				where: {
					proyecto_id: proyectoId,
					estado: { in: ['aprobada', 'pendiente'] }
				},
				include: this.includeOptions,
				orderBy: { created_at: 'desc' }
			});

			return colaboraciones.map((c) => ColaboracionMapper.toDomain(c as any));
		} catch (error) {
			console.error('Error getting colaboraciones por proyecto:', error);
			return [];
		}
	}
}
