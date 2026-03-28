import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';

export class EliminarResena {
	constructor(
		private resenaRepository: ResenaRepository,
		private historialRepo: HistorialDeCambiosRepository
	) {}

	async execute(idResena: number, authUserId: number, isAdmin: boolean = false): Promise<void> {
		const resena = await this.resenaRepository.findById(idResena);

		if (!resena) {
			throw new Error('La reseña no existe.');
		}

		// Regla de negocio: Solo admin o el autor pueden eliminar
		if (resena.autor_id !== authUserId && !isAdmin) {
			throw new Error('No tenés permiso para eliminar esta reseña.');
		}

		await this.historialRepo.create({
			tipo_objeto: 'resena',
			id_objeto: idResena,
			accion: 'eliminacion',
			atributo_afectado: 'registro',
			valor_anterior: String(idResena),
			valor_nuevo: 'eliminado',
			usuario_id: authUserId
		});

		await this.resenaRepository.delete(idResena);
	}
}
