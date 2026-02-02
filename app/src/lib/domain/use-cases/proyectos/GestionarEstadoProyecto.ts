import type { ProyectoRepository } from '../../repositories/ProyectoRepository';
import type { EstadoDescripcion } from '../../types/Estado';
import type { Proyecto } from '../../entities/Proyecto';

export class GestionarEstadoProyecto {
	constructor(private proyectoRepo: ProyectoRepository) {}

	async solicitarCierre(proyectoId: number): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (!proyecto.puedeCambiarA('pendiente_solicitud_cierre')) {
			throw new Error(`No se puede solicitar cierre desde el estado ${proyecto.estado}`);
		}

		// Validar condiciones adicionales
		if (!proyecto.objetivosAlcanzados()) {
			// Dependiendo de la regla estricta: "Objetivos alcanzados total o parcialmente, o institución finaliza ejecución"
			// Si es manual (institución finaliza), permitimos. Si es automático, validamos.
			// Asumimos accion manual aquí:
			console.warn('Advertencia: objetivos no completados al 100%');
		}

		return this.proyectoRepo.updateEstado(proyectoId, 'pendiente_solicitud_cierre');
	}

	async enviarASolicitudCierreConEvidencias(proyectoId: number): Promise<Proyecto> {
		// En preparación de cierre -> En revisión
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (!proyecto.puedeCambiarA('en_revision')) {
			throw new Error(`Transición inválida a En Revisión desde ${proyecto.estado}`);
		}

		// Acá se debería validar que existan evidencias cargadas (lógica adicional)

		return this.proyectoRepo.updateEstado(proyectoId, 'en_revision');
	}

	async aprobarCierre(proyectoId: number): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (!proyecto.puedeCambiarA('completado')) {
			throw new Error(`No se puede completar el proyecto desde ${proyecto.estado}`);
		}

		return this.proyectoRepo.updateEstado(proyectoId, 'completado');
	}

	async rechazarCierre(proyectoId: number, escalar: boolean = false): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		const nuevoEstado: EstadoDescripcion = escalar ? 'en_auditoria' : 'pendiente_solicitud_cierre';

		if (!proyecto.puedeCambiarA(nuevoEstado)) {
			throw new Error(`No se puede cambiar a ${nuevoEstado} desde ${proyecto.estado}`);
		}

		return this.proyectoRepo.updateEstado(proyectoId, nuevoEstado);
	}

	async cancelarProyecto(proyectoId: number): Promise<Proyecto> {
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) throw new Error('Proyecto no encontrado');

		if (!proyecto.puedeCambiarA('cancelado')) {
			throw new Error('No se puede cancelar un proyecto completado');
		}

		return this.proyectoRepo.updateEstado(proyectoId, 'cancelado');
	}
}
