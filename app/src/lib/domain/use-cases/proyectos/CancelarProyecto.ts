import type { ProyectoRepository } from '../../repositories/ProyectoRepository';

export interface CancelarProyectoRequest {
	proyectoId: number;
	usuarioId: number; // La institución que solicita la cancelación
	justificacion?: string;
}

/**
 * Caso de uso para cancelar un proyecto de forma segura.
 * Un proyecto solo puede ser cancelado por su institución creadora
 * si está en estado 'en_curso' y no posee colaboradores aprobados.
 */
export class CancelarProyecto {
	constructor(private proyectoRepo: ProyectoRepository) {}

	async execute(request: CancelarProyectoRequest): Promise<void> {
		const { proyectoId, usuarioId, justificacion } = request;

		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) {
			throw new Error('El proyecto no existe');
		}

		// 1. Verificar que el usuario sea la institución dueña
		if (proyecto.institucion_id !== usuarioId) {
			throw new Error('Solo la institución creadora puede cancelar el proyecto');
		}

		// 2. Verificar estado actual del proyecto
		// Usamos el estado_obj si está cargado o el string 'estado' directo
		const estadoActual = proyecto.estado || proyecto.estado_obj?.descripcion;
		if (estadoActual !== 'en_curso') {
			throw new Error(
				`No se puede cancelar un proyecto que se encuentra en estado: ${estadoActual}`
			);
		}

		// 3. Verificar que no haya colaboradores aprobados
		// Comprobamos el array de colaboraciones
		const tieneAprobados = proyecto.colaboraciones?.some((c) => c.estado === 'aprobada');
		if (tieneAprobados) {
			throw new Error('No se puede cancelar un proyecto que ya cuenta con colaboradores aprobados');
		}

		// 4. Proceder a la cancelación en infraestructura (transaccional)
		await this.proyectoRepo.cancel(proyectoId, justificacion);
	}
}
