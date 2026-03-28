import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';

export class AnularColaboracion {
	constructor(
		private colaboracionRepository: ColaboracionRepository,
		private historialRepo: HistorialDeCambiosRepository
	) {}

	async execute(id: number, usuarioId: number): Promise<Colaboracion> {
		const colaboracion = await this.colaboracionRepository.findById(id);

		if (!colaboracion) {
			throw new Error('Colaboración no encontrada');
		}

		const colaboracionEntity = new Colaboracion(colaboracion);
		const estadoAnterior = colaboracionEntity.estado;
		colaboracionEntity.anular();

		const updated = await this.colaboracionRepository.update(id, {
			estado: colaboracionEntity.estado
		});

		await this.historialRepo.create({
			tipo_objeto: 'colaboracion',
			id_objeto: id,
			accion: 'anulacion',
			atributo_afectado: 'estado',
			valor_anterior: estadoAnterior,
			valor_nuevo: 'anulada',
			usuario_id: usuarioId
		});

		return updated;
	}
}
