import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/entities/Resena';
import type { TipoObjetoResena } from '$lib/domain/types/Resena';

export class ObtenerResenasPorObjeto {
	constructor(private resenaRepository: ResenaRepository) {}

	async execute(tipoObjeto: TipoObjetoResena, idObjeto: number): Promise<Resena[]> {
		// Por defecto, findByObjeto en el repositorio ya filtra por aprobado: true
		return await this.resenaRepository.findByObjeto(tipoObjeto, idObjeto);
	}
}
