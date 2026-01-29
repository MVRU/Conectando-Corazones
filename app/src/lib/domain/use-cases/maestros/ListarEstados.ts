import type { Estado } from '../../entities/Estado';
import type { EstadoRepository } from '../../repositories/EstadoRepository';

export class ListarEstados {
	constructor(private estadoRepo: EstadoRepository) {}

	async execute(): Promise<Estado[]> {
		return this.estadoRepo.findAll();
	}
}
