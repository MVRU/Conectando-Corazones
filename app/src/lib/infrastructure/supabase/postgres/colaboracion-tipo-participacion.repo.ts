import type { ColaboracionTipoParticipacionRepository } from '$lib/domain/repositories/ColaboracionTipoParticipacionRepository';
import { ColaboracionTipoParticipacion } from '$lib/domain/entities/ColaboracionTipoParticipacion';
import { prisma } from '$lib/infrastructure/prisma/client';
import { ColaboracionTipoParticipacionMapper } from './mappers/colaboracion-tipo-participacion.mapper';

export class PostgresColaboracionTipoParticipacionRepository
	implements ColaboracionTipoParticipacionRepository
{
	private includeOptions = {
		colaboracion: true,
		participacion_permitida: { include: { tipo_participacion: true } }
	};

	async findById(id: number): Promise<ColaboracionTipoParticipacion | null> {
		const aporte = await prisma.colaboracionTipoParticipacion.findUnique({
			where: { id_colaboracion_tipo_participacion: id },
			include: this.includeOptions
		});
		return aporte ? ColaboracionTipoParticipacionMapper.toDomain(aporte) : null;
	}

	async findByParticipacionPermitida(
		participacionPermitidaId: number
	): Promise<ColaboracionTipoParticipacion[]> {
		const aportes = await prisma.colaboracionTipoParticipacion.findMany({
			where: { participacion_permitida_id: participacionPermitidaId },
			include: this.includeOptions
		});
		return aportes.map((a) => ColaboracionTipoParticipacionMapper.toDomain(a));
	}

	async findByColaboracionAndParticipacion(
		colaboracionId: number,
		participacionPermitidaId: number
	): Promise<ColaboracionTipoParticipacion | null> {
		const aporte = await prisma.colaboracionTipoParticipacion.findFirst({
			where: {
				colaboracion_id: colaboracionId,
				participacion_permitida_id: participacionPermitidaId
			},
			include: this.includeOptions
		});
		return aporte ? ColaboracionTipoParticipacionMapper.toDomain(aporte) : null;
	}

	// Crea o actualiza aporte + actualiza métricas + registra auditoría
	async upsertConActualizacionMetricas(
		aporte: ColaboracionTipoParticipacion,
		usuarioId: number
	): Promise<ColaboracionTipoParticipacion> {
		if (!aporte.colaboracion_id || !aporte.participacion_permitida_id) {
			throw new Error('El aporte debe tener colaboracion_id y participacion_permitida_id');
		}
		if (aporte.cantidad < 0) {
			throw new Error('La cantidad a agregar no puede ser negativa');
		}

		const result = await prisma.$transaction(async (tx) => {
			// 1. Buscar si ya existe un aporte
			const existente = await tx.colaboracionTipoParticipacion.findFirst({
				where: {
					colaboracion_id: aporte.colaboracion_id!,
					participacion_permitida_id: aporte.participacion_permitida_id!
				}
			});

			let registro;
			let valorAnterior: string;
			let accion: string;
			// La cantidad del aporte es la cantidad a agregar
			const cantidadAAgregar = aporte.cantidad;

			if (existente) {
				// actualiza: suma la cantidad
				valorAnterior = String(existente.cantidad);
				accion = 'actualizar';
				registro = await tx.colaboracionTipoParticipacion.update({
					where: {
						id_colaboracion_tipo_participacion: existente.id_colaboracion_tipo_participacion
					},
					data: { cantidad: { increment: cantidadAAgregar } },
					include: this.includeOptions
				});
			} else {
				//nuevo registro
				valorAnterior = '0';
				accion = 'crear';
				const data = ColaboracionTipoParticipacionMapper.toPrisma(aporte);
				registro = await tx.colaboracionTipoParticipacion.create({
					data,
					include: this.includeOptions
				});
			}

			// 3. Registra en log de auditoría
			await tx.historialDeCambios.create({
				data: {
					tipo_objeto: 'colaboracion_tipo_participacion',
					id_objeto: registro.id_colaboracion_tipo_participacion,
					accion,
					atributo_afectado: 'cantidad',
					valor_anterior: valorAnterior,
					valor_nuevo: String(registro.cantidad),
					usuario_id: usuarioId
				}
			});

			return registro;
		});

		return ColaboracionTipoParticipacionMapper.toDomain(result);
	}
}
