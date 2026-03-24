import type { SolicitudFinalizacionRepository } from '$lib/domain/repositories/SolicitudFinalizacionRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { EvidenciaRepository } from '$lib/domain/repositories/EvidenciaRepository';
import type { SolicitudFinalizacion } from '$lib/domain/types/SolicitudFinalizacion';

export class CrearSolicitudFinalizacion {
	constructor(
		private readonly solicitudRepo: SolicitudFinalizacionRepository,
		private readonly proyectoRepo: ProyectoRepository,
		private readonly evidenciaRepo: EvidenciaRepository
	) {}

	/**
	 * Crea una solicitud de finalización para un proyecto de una institución.
	 *
	 * Reglas principales:
	 * - Solo la institución dueña del proyecto puede solicitar el cierre.
	 * - El proyecto debe estar en estado 'pendiente_solicitud_cierre'.
	 * - Debe existir al menos una evidencia asociada al proyecto.
	 * - No puede existir ya una solicitud pendiente.
	 * - Si el proyecto tiene 3 solicitudes rechazadas, no se permite una nueva.
	 */
	async execute(
		idInstitucion: number,
		idProyecto: number,
		evidenciaIds: number[]
	): Promise<SolicitudFinalizacion> {
		const proyecto = await this.proyectoRepo.findById(idProyecto);
		if (!proyecto) {
			throw new Error('Proyecto no encontrado.');
		}

		if (proyecto.institucion_id !== idInstitucion) {
			throw new Error('No tiene permisos para solicitar el cierre de este proyecto.');
		}

		if (proyecto.estado !== 'pendiente_solicitud_cierre') {
			throw new Error(
				'El proyecto debe estar en estado "pendiente_solicitud_cierre" para solicitar el cierre.'
			);
		}

		// Verificar si ya existe una solicitud de finalización para este proyecto (pendiente)
		const solicitudExistente = await this.solicitudRepo.findByProyectoId(idProyecto);
		if (solicitudExistente && solicitudExistente.estado === 'pendiente') {
			throw new Error('Ya existe una solicitud de finalización pendiente para este proyecto.');
		}

		// Verificar cantidad de solicitudes rechazadas
		const rechazadasCount = await this.solicitudRepo.countRechazadasByProyectoId(idProyecto);
		if (rechazadasCount >= 3) {
			throw new Error(
				'Este proyecto alcanzó el límite de 3 solicitudes de finalización rechazadas.'
			);
		}

		if (!evidenciaIds || evidenciaIds.length === 0) {
			throw new Error('Debe seleccionar al menos una evidencia para respaldar la solicitud.');
		}

		// Validar que las evidencias pertenezcan al proyecto
		const evidenciasProyecto = await this.evidenciaRepo.findAllByProyecto(idProyecto);
		const idsValidos = new Set(evidenciasProyecto.map((e) => e.id_evidencia));
		const idsInvalidos = evidenciaIds.filter((id) => !idsValidos.has(id));

		if (idsInvalidos.length > 0) {
			throw new Error('Alguna de las evidencias seleccionadas no pertenece a este proyecto.');
		}

		const solicitud: SolicitudFinalizacion = {
			proyecto_id: idProyecto,
			evidencia_ids: evidenciaIds,
			estado: 'pendiente'
		};

		return this.solicitudRepo.create(solicitud);
	}
}

