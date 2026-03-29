import type { VerificacionRepository } from '$lib/domain/repositories/VerificacionRepository';
import type { Verificacion } from '$lib/domain/types/Verificacion';
import { esTipoVerificacionCanonico } from '$lib/domain/types/Verificacion';

export class SolicitarVerificacion {
	constructor(private verificacionRepo: VerificacionRepository) {}

	/**
	 * RN: Solo el propio usuario puede solicitar una verificación para sí mismo.
	 * RN: El tipo debe ser canónico (`email_institucional`, `documental`, `renaper`).
	 * RN: No puede existir otra solicitud `pendiente` del mismo tipo para el mismo usuario.
	 */
	async execute(usuarioId: number, actorUserId: number, tipo: string): Promise<Verificacion> {
		if (usuarioId !== actorUserId) {
			throw new Error('Solo podés solicitar verificación para tu propio usuario.');
		}
		if (!esTipoVerificacionCanonico(tipo)) {
			throw new Error(`Tipo de verificación no válido: ${tipo}`);
		}

		const pendiente = await this.verificacionRepo.findPendienteByUsuarioAndTipo(usuarioId, tipo);
		if (pendiente) {
			throw new Error('Ya tenés una verificación pendiente de este tipo.');
		}

		return this.verificacionRepo.create(
			{
				tipo,
				estado: 'pendiente',
				usuario_id: usuarioId
			},
			actorUserId
		);
	}
}
