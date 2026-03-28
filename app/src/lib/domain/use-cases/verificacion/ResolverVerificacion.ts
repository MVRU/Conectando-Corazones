import type { VerificacionRepository } from '$lib/domain/repositories/VerificacionRepository';
import type { Verificacion } from '$lib/domain/types/Verificacion';
import { esEstadoVerificacionCanonico } from '$lib/domain/types/Verificacion';

export class ResolverVerificacion {
	constructor(private verificacionRepo: VerificacionRepository) {}

	/**
	 * RN: Solo un administrador puede resolver (aprobar/rechazar) una verificación.
	 * RN: El nuevo estado debe ser `aprobada` o `rechazada` (no se fuerza `pendiente` desde este caso de uso).
	 */
	async execute(
		idVerificacion: number,
		actorRol: string,
		actorUserId: number,
		nuevoEstado: string,
		fechaVencimiento?: Date | null
	): Promise<Verificacion> {
		if (actorRol !== 'administrador') {
			throw new Error('Solo un administrador puede resolver verificaciones.');
		}
		if (!esEstadoVerificacionCanonico(nuevoEstado)) {
			throw new Error(`Estado no válido: ${nuevoEstado}`);
		}
		if (nuevoEstado === 'pendiente') {
			throw new Error(
				'No se puede dejar una verificación en pendiente desde la resolución administrativa.'
			);
		}

		const actual = await this.verificacionRepo.findById(idVerificacion);
		if (!actual) {
			throw new Error('Verificación no encontrada.');
		}

		return this.verificacionRepo.updateEstado(idVerificacion, nuevoEstado, {
			actorUserId,
			fecha_vencimiento: fechaVencimiento
		});
	}
}
