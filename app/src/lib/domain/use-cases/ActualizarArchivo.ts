import type { ArchivoRepository } from '../repositories/ArchivoRepository';
import type { ProyectoRepository } from '../repositories/ProyectoRepository';
import type { HistorialDeCambiosRepository } from '../repositories/HistorialDeCambiosRepository';
import type { Archivo } from '../entities/Archivo';

export class ActualizarArchivo {
	constructor(
		private archivoRepo: ArchivoRepository,
		private proyectoRepo: ProyectoRepository,
		private historialRepo: HistorialDeCambiosRepository
	) {}

	async execute(
		archivoId: number,
		usuarioSolicitanteId: number,
		nuevosDatos: Partial<Archivo>
	): Promise<void> {
		const archivo = await this.archivoRepo.findById(archivoId);

		if (!archivo) {
			throw new Error('El archivo no existe.');
		}

		// Validar propiedad
		if (archivo.usuario_id !== usuarioSolicitanteId) {
			throw new Error('No tenés permisos para editar este archivo. Solo el dueño puede hacerlo.');
		}

		// RN 16: Validar estado del proyecto
		if (!archivo.proyecto_id) {
			throw new Error('El archivo no está vinculado a ningún proyecto.');
		}

		const proyecto = await this.proyectoRepo.findById(archivo.proyecto_id);
		if (!proyecto) {
			throw new Error('El proyecto asociado al archivo no existe.');
		}

		const estado = proyecto.estado;
		if (estado === 'completado' || estado === 'cancelado' || estado === 'en_auditoria') {
			throw new Error(
				`No se puede editar el archivo porque el proyecto está en estado: ${estado}.`
			);
		}

		// Registrar cambios en el historial
		const entries = Object.entries(nuevosDatos);
		for (const [key, value] of entries) {
			const valorAnterior = (archivo as any)[key];
			if (valorAnterior !== value) {
				await this.historialRepo.create({
					tipo_objeto: 'Archivo',
					id_objeto: archivoId,
					accion: 'Actualizar',
					atributo_afectado: key,
					valor_anterior: String(valorAnterior),
					valor_nuevo: String(value),
					justificacion: `Actualización de metadatos de archivo.`,
					usuario_id: usuarioSolicitanteId
				});
			}
		}

		await this.archivoRepo.update(archivoId, nuevosDatos);
	}
}
