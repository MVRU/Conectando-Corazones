import type { ProyectoRepository } from '../../repositories/ProyectoRepository';

export interface CancelarProyectoRequest {
	proyectoId: number;
	usuarioId: number; // El ID del usuario que solicita (puede ser institución o admin)
	rol: string; // El rol del usuario ('institucion' | 'administrador')
	justificacion?: string;
}

/**
 * Caso de uso para cancelar un proyecto de forma segura.
 * - Institución: Solo puede cancelar su propio proyecto si está 'en_curso'
 *   y no posee colaboradores aprobados.
 * - Administrador: Puede cancelar cualquier proyecto en cualquier estado
 *   no terminal por fraude o irregularidad.
 */
export class CancelarProyecto {
	constructor(private proyectoRepo: ProyectoRepository) {}

	async execute(request: CancelarProyectoRequest): Promise<void> {
		const { proyectoId, usuarioId, rol, justificacion } = request;

		const proyecto = await this.proyectoRepo.findById(proyectoId);
		if (!proyecto) {
			throw new Error('El proyecto no existe');
		}

		const esAdmin = rol === 'administrador';
		const esInstitucionDueña = proyecto.institucion_id === usuarioId;

		// 1. Verificar autoría (si no es admin)
		if (!esAdmin && !esInstitucionDueña) {
			throw new Error('No tenés permisos para cancelar este proyecto');
		}

		// 2. Verificar estado actual del proyecto
		const estadoActual = proyecto.estado || proyecto.estado_obj?.descripcion;

		if (estadoActual === 'cancelado' || estadoActual === 'completado') {
			throw new Error(`No se puede cancelar un proyecto que ya está ${estadoActual}`);
		}

		// 3. Reglas específicas por rol
		if (!esAdmin) {
			// Reglas para la institución
			if (estadoActual !== 'en_curso') {
				throw new Error(
					`Solo podés cancelar proyectos que se encuentran 'en curso'. Estado actual: ${estadoActual}`
				);
			}

			const tieneAprobados = proyecto.colaboraciones?.some((c) => c.estado === 'aprobada');
			if (tieneAprobados) {
				throw new Error(
					'No podés cancelar el proyecto porque ya cuenta con colaboradores aprobados. Si necesitás asistencia contactate con soporte.'
				);
			}
		}

		// 4. Proceder a la cancelación en infraestructura (transaccional)
		await this.proyectoRepo.cancel(proyectoId, usuarioId, justificacion);
	}
}
