import type { EvidenciaRepository } from '../repositories/EvidenciaRepository';
import type { ProyectoRepository } from '../repositories/ProyectoRepository';
import type { ColaboracionRepository } from '../repositories/ColaboracionRepository';
import type { ParticipacionPermitidaRepository } from '../repositories/ParticipacionPermitidaRepository';
import type { HistorialDeCambiosRepository } from '../repositories/HistorialDeCambiosRepository';
import { Evidencia } from '../entities/Evidencia';
import type { Archivo } from '../entities/Archivo';

export class SubirEvidencia {
	constructor(
		private evidenciaRepo: EvidenciaRepository,
		private proyectoRepo: ProyectoRepository,
		private colaboracionRepo: ColaboracionRepository,
		private participacionRepo: ParticipacionPermitidaRepository,
		private historialRepo: HistorialDeCambiosRepository
	) {}

	async execute(
		usuarioId: number,
		usuarioRol: string,
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
		const estadoDescripcion = proyecto.estado;

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
			// RN 44 / Evidencia de COLABORADOR
			if (usuarioRol !== 'colaborador') {
				throw new Error('Solo los colaboradores pueden subir evidencias de entrada.');
			}

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
			// RN 14 / Evidencia de INSTITUCIÓN
			if (usuarioRol !== 'institucion') {
				throw new Error('Solo las instituciones pueden subir evidencias de salida.');
			}

			// Verificar que el usuario sea el creador del proyecto.
			if (proyecto.institucion_id !== usuarioId) {
				throw new Error(
					'Solo la institución responsable del proyecto puede subir evidencias de salida.'
				);
			}
		}

		// 4. Preparar archivos
		// Aseguramos que los archivos tengan el ID de proyecto correcto
		const archivosConProyecto = archivos.map((a) => {
			a.proyecto_id = proyectoId;
			return a;
		});

		// 5. Verificar si ya existe evidencia para esta participación y tipo
		const evidenciaExistente = await this.evidenciaRepo.findByParticipacionAndTipo(
			idParticipacionPermitida,
			tipoEvidencia
		);

		if (evidenciaExistente) {
			// Si existe, agregamos los archivos a esa evidencia
			if (!evidenciaExistente.id_evidencia) {
				throw new Error('Error de integridad: La evidencia existente no tiene ID.');
			}

			const nuevosArchivos = await this.evidenciaRepo.addArchivos(
				evidenciaExistente.id_evidencia,
				archivosConProyecto
			);

			// Registrar en Historial
			await Promise.all(
				archivosConProyecto.map((a) =>
					this.historialRepo.create({
						tipo_objeto: 'Archivo',
						id_objeto: evidenciaExistente.id_evidencia!, // Relacionado a la evidencia
						accion: 'Crear',
						atributo_afectado: 'evidencia_id',
						valor_anterior: 'null',
						valor_nuevo: `Evidencia ${evidenciaExistente.id_evidencia}`,
						justificacion: `Archivo agregado a evidencia existente: ${a.nombre_original}`,
						usuario_id: usuarioId
					})
				)
			);

			// Retornamos la evidencia existente actualizada con los nuevos archivos (en memoria para response)
			evidenciaExistente.archivos = [...(evidenciaExistente.archivos || []), ...nuevosArchivos];
			return evidenciaExistente;
		} else {
			// Si no existe, creamos el "contenedor" de evidencia y sus primeros archivos
			const nuevaEvidencia = new Evidencia({
				tipo_evidencia: tipoEvidencia,
				id_participacion_permitida: idParticipacionPermitida,
				archivos: archivosConProyecto
			});

			const evidenciaCreada = await this.evidenciaRepo.create(nuevaEvidencia);

			// Registrar en Historial
			await this.historialRepo.create({
				tipo_objeto: 'Evidencia',
				id_objeto: evidenciaCreada.id_evidencia!,
				accion: 'Crear',
				atributo_afectado: 'id_evidencia',
				valor_anterior: 'null',
				valor_nuevo: `Evidencia ${evidenciaCreada.id_evidencia}`,
				justificacion: `Nueva evidencia de ${tipoEvidencia} creada con ${archivos.length} archivos.`,
				usuario_id: usuarioId
			});

			return evidenciaCreada;
		}
	}
}
