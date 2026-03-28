import type { ReporteRepository } from '$lib/domain/repositories/ReporteRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';
import type { Reporte } from '$lib/domain/entities/Reporte';
import type { EstadoDescripcion } from '$lib/domain/types/Estado';

export class ResolverReporte {
	constructor(
		private reporteRepository: ReporteRepository,
		private historialRepo: HistorialDeCambiosRepository,
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

		// 4. Registrar la resolución del reporte en el historial
		await this.historialRepo.create({
			tipo_objeto: 'reporte',
			id_objeto: data.reporte_id,
			accion: data.nuevo_estado === 'verificado' ? 'verificacion' : 'desestimacion',
			atributo_afectado: 'estado',
			valor_anterior: 'pendiente',
			valor_nuevo: data.nuevo_estado,
			justificacion: data.comentario,
			usuario_id: data.admin_id
		});

		// 5. Consecuencias en el proyecto reportado
		if (reporteActualizado.tipo_objeto === 'Proyecto' && this.proyectoRepository) {
			if (data.nuevo_estado === 'verificado') {
				// Reporte verdadero: cancelar el proyecto
				const proyecto = await this.proyectoRepository.findById(reporteActualizado.id_objeto);
				await this.proyectoRepository.cancel(
					reporteActualizado.id_objeto,
					data.admin_id,
					data.comentario || 'Cancelación por reporte verificado'
				);
				await this.historialRepo.create({
					tipo_objeto: 'proyecto',
					id_objeto: reporteActualizado.id_objeto,
					accion: 'cancelacion',
					atributo_afectado: 'estado',
					valor_anterior: proyecto?.estado || 'en_auditoria',
					valor_nuevo: 'cancelado',
					justificacion: data.comentario || 'Cancelación por reporte verificado',
					usuario_id: data.admin_id
				});
			} else {
				// Reporte (desestimado): vuelve al estado anterior
				// 1. Buscar en el historial cuál era el estado antes de 'en_auditoria'
				const historial = await this.historialRepo.findByObjeto('proyecto', reporteActualizado.id_objeto);

				// Buscamos el registro más reciente de cambio_estado hacia 'en_auditoria'
				const registroAuditoria = historial.find(
					(h) => h.accion === 'cambio_estado' && h.valor_nuevo === 'en_auditoria'
				);

				const estadoARestaurar = (registroAuditoria?.valor_anterior as EstadoDescripcion) || 'en_curso';

				await this.proyectoRepository.updateEstado(reporteActualizado.id_objeto, estadoARestaurar);

				// Registrar la restauración en el historial
				await this.historialRepo.create({
					tipo_objeto: 'proyecto',
					id_objeto: reporteActualizado.id_objeto,
					accion: 'restauracion_estado',
					atributo_afectado: 'estado',
					valor_anterior: 'en_auditoria',
					valor_nuevo: estadoARestaurar,
					justificacion: 'Restauración de estado tras desestimación de reporte',
					usuario_id: data.admin_id
				});
			}
		}

		return reporteActualizado;
	}
}
