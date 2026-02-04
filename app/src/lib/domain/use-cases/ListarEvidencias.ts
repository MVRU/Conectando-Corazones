import type { EvidenciaRepository } from '../repositories/EvidenciaRepository';
import type { Evidencia } from '../entities/Evidencia';

export class ListarEvidencias {
	constructor(private evidenciaRepo: EvidenciaRepository) {}

	async execute(proyectoId: number): Promise<Evidencia[]> {
		return await this.evidenciaRepo.findAllByProyecto(proyectoId);
	}
}
