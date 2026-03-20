import type { Reporte } from '$lib/domain/entities/Reporte';

export type ReporteFilters = {
	estado?: 'pendiente' | 'verificado' | 'desestimado';
	tipo_objeto?: 'Usuario' | 'Proyecto';
	reportante_id?: number;
	desde?: Date;
	hasta?: Date;
	limit?: number;
	offset?: number;
};

export interface ReporteRepository {
	create(reporte: Reporte): Promise<Reporte>;
	findById(id: number): Promise<Reporte | null>;
	findByReportanteAndObjeto(
		reportante_id: number,
		tipo_objeto: 'Usuario' | 'Proyecto',
		id_objeto: number
	): Promise<Reporte | null>;
	findAll(filters?: ReporteFilters): Promise<{ data: Reporte[]; total: number }>;
	save(reporte: Reporte): Promise<Reporte>;
}

