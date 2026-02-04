import type { EvidenciaRepository } from '../repositories/EvidenciaRepository';
import type { ProyectoRepository } from '../repositories/ProyectoRepository';
import type { ColaboracionRepository } from '../repositories/ColaboracionRepository';
import type { ParticipacionPermitidaRepository } from '../repositories/ParticipacionPermitidaRepository';
import { Evidencia } from '../entities/Evidencia';
import type { Archivo } from '../entities/Archivo';

export class SubirEvidencia {
	constructor(
		private evidenciaRepo: EvidenciaRepository,
		private proyectoRepo: ProyectoRepository,
		private colaboracionRepo: ColaboracionRepository,
		private participacionRepo: ParticipacionPermitidaRepository
	) {}

	async execute(
		usuarioId: number,
		idParticipacionPermitida: number,
		tipoEvidencia: 'entrada' | 'salida',
		archivos: Archivo[]
	): Promise<Evidencia> {
		// 1. Obtener Participación Permitida para saber a qué proyecto pertenece
		const participacion = await this.participacionRepo.findById(idParticipacionPermitida);
		if (!participacion) {
			throw new Error('La participación permitida no existe.');
		}

		const proyectoId = participacion.id_proyecto;
		if (!proyectoId) {
			throw new Error('La participación no está vinculada a un proyecto válido.');
		}

		// 2. Obtener Proyecto para validar estado
		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) {
			throw new Error('El proyecto no existe.');
		}

		// Validar estado del proyecto (Regla de negocio)
		const estadoDescripcion = proyecto.estado?.descripcion;

		if (!estadoDescripcion) {
			throw new Error('El proyecto no tiene un estado válido asignado.');
		}

		const estadoValido =
			estadoDescripcion === 'en_curso' || estadoDescripcion === 'pendiente_solicitud_cierre';

		if (!estadoValido) {
			throw new Error(
				'Solo se pueden subir evidencias si el proyecto está en curso o pendiente de iniciar la solicitud de cierre.'
			);
		}

		// 3. Validar permisos según tipo de evidencia
		if (tipoEvidencia === 'entrada') {
			// Evidencia de COLABORADOR
			// Verificar que el usuario tenga una colaboración APROBADA en este proyecto
			const colaboracion = await this.colaboracionRepo.findByProyectoAndColaborador(
				proyectoId,
				usuarioId
			);

			if (!colaboracion) {
				throw new Error('No tienes ninguna colaboración en este proyecto.');
			}

			// Validar estado de colaboración
			if (colaboracion.estado !== 'aprobada') {
				throw new Error('Tu colaboración debe estar aprobada para subir evidencias.');
			}
		} else if (tipoEvidencia === 'salida') {
			// Evidencia de INSTITUCIÓN
			// Verificar que el usuario sea el creador del proyecto.
			if (proyecto.usuario_id !== usuarioId) {
				throw new Error(
					'Solo la institución responsable del proyecto puede subir evidencias de salida.'
				);
			}
		}

		// 4. Crear la entidad Evidencia
		// Aseguramos que los archivos tengan el ID de proyecto correcto
		const archivosConProyecto = archivos.map((a) => {
			a.proyecto_id = proyectoId;
			return a;
		});

		const nuevaEvidencia = new Evidencia({
			tipo_evidencia: tipoEvidencia,
			id_participacion_permitida: idParticipacionPermitida,
			archivos: archivosConProyecto
		});

		// 5. Persistir
		return await this.evidenciaRepo.create(nuevaEvidencia);
	}
}
