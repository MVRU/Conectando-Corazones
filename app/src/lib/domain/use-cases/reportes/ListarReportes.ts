import type { ReporteRepository, ReporteFilters } from '$lib/domain/repositories/ReporteRepository';
import type { Reporte } from '$lib/domain/entities/Reporte';

export class ListarReportes {
	constructor(private reporteRepository: ReporteRepository) {}

	async execute(filters?: ReporteFilters): Promise<{ data: Reporte[]; total: number }> {
		return await this.reporteRepository.findAll(filters);
	}
}
