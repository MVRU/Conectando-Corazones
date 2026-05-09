import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { HistorialDeCambiosRepository } from '../../repositories/HistorialDeCambiosRepository';
import type { EstadoDescripcion } from '../../types/Estado';
import type { Proyecto } from '../../entities/Proyecto';

export class GestionarEstadoProyecto {
	constructor(
		private proyectoRepo: ProyectoRepository,
		private historialRepo: HistorialDeCambiosRepository
	) {}

	async solicitarCierre(proyectoId: number, usuarioId: number): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (proyecto.institucion_id !== usuarioId) {
			throw new Error('No tenés permiso para finalizar las actividades de este proyecto');
		}

		if (!proyecto.puedeCambiarA('pendiente_solicitud_cierre')) {
			throw new Error(`No se puede solicitar cierre desde el estado ${proyecto.estado}`);
		}

		if (!proyecto.objetivosAlcanzados()) {
			console.warn('Advertencia: objetivos no completados al 100%');
		}

		const estadoAnterior = proyecto.estado ?? 'desconocido';
		const proyectoActualizado = await this.proyectoRepo.updateEstado(proyectoId, 'pendiente_solicitud_cierre');

		await this.historialRepo.create({
			tipo_objeto: 'proyecto',
			id_objeto: proyectoId,
			accion: 'solicitar_cierre',
			atributo_afectado: 'estado',
			valor_anterior: estadoAnterior,
			valor_nuevo: 'pendiente_solicitud_cierre',
			usuario_id: usuarioId
		});

		return proyectoActualizado;
	}

	async enviarASolicitudCierreConEvidencias(proyectoId: number, usuarioId: number): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (!proyecto.puedeCambiarA('en_revision')) {
			throw new Error(`Transición inválida a En Revisión desde ${proyecto.estado}`);
		}

		const estadoAnterior = proyecto.estado ?? 'desconocido';
		const proyectoActualizado = await this.proyectoRepo.updateEstado(proyectoId, 'en_revision');

		await this.historialRepo.create({
			tipo_objeto: 'proyecto',
			id_objeto: proyectoId,
			accion: 'enviar_solicitud_cierre',
			atributo_afectado: 'estado',
			valor_anterior: estadoAnterior,
			valor_nuevo: 'en_revision',
			usuario_id: usuarioId
		});

		return proyectoActualizado;
	}

	async aprobarCierre(proyectoId: number, usuarioId: number): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (!proyecto.puedeCambiarA('completado')) {
			throw new Error(`No se puede completar el proyecto desde ${proyecto.estado}`);
		}

		const estadoAnterior = proyecto.estado ?? 'desconocido';
		const proyectoActualizado = await this.proyectoRepo.updateEstado(proyectoId, 'completado');

		await this.historialRepo.create({
			tipo_objeto: 'proyecto',
			id_objeto: proyectoId,
			accion: 'aprobar_cierre',
			atributo_afectado: 'estado',
			valor_anterior: estadoAnterior,
			valor_nuevo: 'completado',
			usuario_id: usuarioId
		});

		return proyectoActualizado;
	}

	async rechazarCierre(proyectoId: number, usuarioId: number, escalar: boolean = false): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		const nuevoEstado: EstadoDescripcion = escalar ? 'en_auditoria' : 'pendiente_solicitud_cierre';

		if (!proyecto.puedeCambiarA(nuevoEstado)) {
			throw new Error(`No se puede cambiar a ${nuevoEstado} desde ${proyecto.estado}`);
		}

		const estadoAnterior = proyecto.estado ?? 'desconocido';
		const proyectoActualizado = await this.proyectoRepo.updateEstado(proyectoId, nuevoEstado);

		await this.historialRepo.create({
			tipo_objeto: 'proyecto',
			id_objeto: proyectoId,
			accion: 'rechazar_cierre',
			atributo_afectado: 'estado',
			valor_anterior: estadoAnterior,
			valor_nuevo: nuevoEstado,
			usuario_id: usuarioId
		});

		return proyectoActualizado;
	}

	async cancelarProyecto(proyectoId: number, usuarioId: number): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (!proyecto.puedeCambiarA('cancelado')) {
			throw new Error('No se puede cancelar un proyecto completado');
		}

		const estadoAnterior = proyecto.estado ?? 'desconocido';
		const proyectoActualizado = await this.proyectoRepo.updateEstado(proyectoId, 'cancelado');

		await this.historialRepo.create({
			tipo_objeto: 'proyecto',
			id_objeto: proyectoId,
			accion: 'cancelacion',
			atributo_afectado: 'estado',
			valor_anterior: estadoAnterior,
			valor_nuevo: 'cancelado',
			usuario_id: usuarioId
		});

		return proyectoActualizado;
	}
}
