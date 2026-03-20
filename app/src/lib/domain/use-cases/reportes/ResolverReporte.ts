import type { ReporteRepository } from '$lib/domain/repositories/ReporteRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { Reporte } from '$lib/domain/entities/Reporte';

export class ResolverReporte {
	constructor(
		private reporteRepository: ReporteRepository,
		private proyectoRepository?: ProyectoRepository
	) { }

	async execute(data: {
		reporte_id: number;
		nuevo_estado: 'verificado' | 'desestimado';
		admin_id: number;
		comentario?: string;
	}): Promise<Reporte> {
		// 1. Obtener la entidad
		const reporte = await this.reporteRepository.findById(data.reporte_id);
		if (!reporte) {
			throw new Error('Reporte no encontrado.');
		}

		// 2. Aplicar lógica de negocio en la entidad (valida que esté pendiente)
		if (data.nuevo_estado === 'verificado') {
			reporte.verificar(data.admin_id, data.comentario);
		} else {
			reporte.desestimar(data.admin_id, data.comentario);
		}

		// 3. Persistir el estado actualizado
		const reporteActualizado = await this.reporteRepository.save(reporte);

		// 4. Consecuencias en el proyecto reportado
		if (reporteActualizado.tipo_objeto === 'Proyecto' && this.proyectoRepository) {
			if (data.nuevo_estado === 'verificado') {
				// Reporte verdadero: Infracción comprobada
				await this.proyectoRepository.cancel(
					reporteActualizado.id_objeto,
					data.admin_id,
					data.comentario || 'Cancelación por reporte verificado'
				);
			} else {
				// Reporte falso (desestimado): Volver al estado normal
				// TODO: Usar HistorialDeCambios para volver al estado *exacto* 
				await this.proyectoRepository.updateEstado(reporteActualizado.id_objeto, 'en_curso');
			}
		}

		return reporteActualizado;
	}
}
