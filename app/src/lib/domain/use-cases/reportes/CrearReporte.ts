import type { ReporteRepository } from '$lib/domain/repositories/ReporteRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import { Reporte } from '$lib/domain/entities/Reporte';
import type { MotivoReporte } from '$lib/domain/types/Reporte';

export class CrearReporte {
	constructor(
		private reporteRepository: ReporteRepository,
		private historialRepo: HistorialDeCambiosRepository,
		private proyectoRepository?: ProyectoRepository
	) { }

	async execute(data: {
		tipo_objeto: 'Usuario' | 'Proyecto';
		id_objeto: number;
		motivo: MotivoReporte;
		descripcion: string;
		reportante_id: number;
	}): Promise<Reporte> {
		// 1. Construir la entidad para validar los datos antes de hacer operaciones (Domain check)
		const reporte = new Reporte({ ...data, estado: 'pendiente' });

		// 2. Verificar duplicado en la DB
		const existente = await this.reporteRepository.findByReportanteAndObjeto(
			data.reportante_id,
			data.tipo_objeto,
			data.id_objeto
		);
		if (existente) {
			throw new Error('Ya enviaste un reporte para este elemento. Solo se permite uno por entidad.');
		}

		// 3. Persistir la entidad construida y validada
		const reporteCreado = await this.reporteRepository.create(reporte);

		// 4. Consecuencias: si es Proyecto, pasarlo a 'en_auditoria' temporalmente
		if (reporteCreado.tipo_objeto === 'Proyecto' && this.proyectoRepository) {
			// Obtener estado anterior para el log de auditoría
			const proyecto = await this.proyectoRepository.findById(reporteCreado.id_objeto);
			const estadoAnterior = proyecto?.estado || 'desconocido';

			await this.proyectoRepository.updateEstado(reporteCreado.id_objeto, 'en_auditoria');

			// Registrar el cambio de estado en el historial
			await this.historialRepo.create({
				tipo_objeto: 'proyecto',
				id_objeto: reporteCreado.id_objeto,
				accion: 'cambio_estado',
				atributo_afectado: 'estado',
				valor_anterior: estadoAnterior,
				valor_nuevo: 'en_auditoria',
				justificacion: 'Cambio automático por recepción de reporte',
				usuario_id: data.reportante_id
			});
		}

		await this.historialRepo.create({
			tipo_objeto: 'reporte',
			id_objeto: reporteCreado.id_reporte ?? 0,
			accion: 'creacion',
			atributo_afectado: 'registro',
			valor_anterior: '-',
			valor_nuevo: String(reporteCreado.id_reporte ?? 0),
			usuario_id: data.reportante_id
		});

		return reporteCreado;
	}
}
