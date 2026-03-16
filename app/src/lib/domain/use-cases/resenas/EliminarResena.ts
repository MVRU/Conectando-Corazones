import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';

export class EliminarResena {
	constructor(private resenaRepository: ResenaRepository) {}

	async execute(idResena: number, authUserId: number, isAdmin: boolean = false): Promise<void> {
		const resena = await this.resenaRepository.findById(idResena);

		if (!resena) {
			throw new Error('La reseña no existe.');
		}

		// Regla de negocio: Solo admin o el autor pueden eliminar
		if (resena.autor_id !== authUserId && !isAdmin) {
			throw new Error('No tenés permiso para eliminar esta reseña.');
		}

		await this.resenaRepository.delete(idResena);
	}
}
