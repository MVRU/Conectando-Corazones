import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { TipoObjetoResena } from '$lib/domain/types/Resena';

export class YaResenoUsuario {
	constructor(private resenaRepository: ResenaRepository) {}

	async execute(
		autorId: number,
		tipoObjeto: TipoObjetoResena,
		idObjeto: number
	): Promise<boolean> {
		const resena = await this.resenaRepository.findByAutorAndObjeto(
			autorId,
			tipoObjeto,
			idObjeto
		);
		return resena !== null;
	}
}
