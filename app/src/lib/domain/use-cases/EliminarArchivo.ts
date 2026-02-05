import type { ArchivoRepository } from '../repositories/ArchivoRepository';
import type { ProyectoRepository } from '../repositories/ProyectoRepository';
import type { HistorialDeCambiosRepository } from '../repositories/HistorialDeCambiosRepository';
import type { Archivo } from '../entities/Archivo';

export class EliminarArchivo {
	constructor(
		private archivoRepo: ArchivoRepository,
		private proyectoRepo: ProyectoRepository,
		private historialRepo: HistorialDeCambiosRepository
	) {}

	async execute(archivoId: number, usuarioSolicitanteId: number): Promise<Archivo> {
		const archivo = await this.archivoRepo.findById(archivoId);

		if (!archivo) {
			throw new Error('El archivo no existe.');
		}

		if (archivo.usuario_id !== usuarioSolicitanteId) {
			throw new Error('No tenés permisos para eliminar este archivo. Solo el dueño puede hacerlo.');
		}

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
				`No se puede eliminar el archivo porque el proyecto está en estado: ${estado}.`
			);
		}

		// Registrar en Historial antes de borrar
		await this.historialRepo.create({
			tipo_objeto: 'Archivo',
			id_objeto: archivoId,
			accion: 'Eliminar',
			atributo_afectado: 'id_archivo',
			valor_anterior: JSON.stringify({
				url: archivo.url,
				nombre: archivo.nombre_original
			}),
			valor_nuevo: 'Eliminado',
			justificacion: `Archivo eliminado por el usuario dueño.`,
			usuario_id: usuarioSolicitanteId
		});

		await this.archivoRepo.delete(archivoId);

		return archivo;
	}
}
