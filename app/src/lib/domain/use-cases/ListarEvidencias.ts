import type { EvidenciaRepository } from '../repositories/EvidenciaRepository';
import type { ProyectoRepository } from '../repositories/ProyectoRepository';
import type { ColaboracionRepository } from '../repositories/ColaboracionRepository';
import type { Evidencia } from '../entities/Evidencia';

export class ListarEvidencias {
	constructor(
		private evidenciaRepo: EvidenciaRepository,
		private proyectoRepo: ProyectoRepository,
		private colaboracionRepo: ColaboracionRepository
	) {}

	async execute(proyectoId: number, usuarioId: number, usuarioRol: string): Promise<Evidencia[]> {
		// Admin siempre puede ver
		if (usuarioRol === 'administrador') {
			return await this.evidenciaRepo.findAllByProyecto(proyectoId);
		}

		// 1. Verificar si el proyecto existe
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) {
			throw new Error('El proyecto no existe.');
		}

		// 2. Si es institución, debe ser la dueña del proyecto
		if (usuarioRol === 'institucion') {
			if (proyecto.institucion_id !== usuarioId) {
				throw new Error('No tenés permisos para ver las evidencias de este proyecto.');
			}
		}

		// 3. Si es colaborador, debe tener una colaboración activa (aprobada)
		if (usuarioRol === 'colaborador') {
			const colaboracion = await this.colaboracionRepo.findByProyectoAndColaborador(
				proyectoId,
				usuarioId
			);

			if (!colaboracion || colaboracion.estado !== 'aprobada') {
				throw new Error(
					'Debés tener una colaboración aprobada para ver las evidencias del proyecto.'
				);
			}
		}

		return await this.evidenciaRepo.findAllByProyecto(proyectoId);
	}
}
