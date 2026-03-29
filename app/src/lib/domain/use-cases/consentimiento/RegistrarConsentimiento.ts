import type { ConsentimientoRepository } from '$lib/domain/repositories/ConsentimientoRepository';
import type { Consentimiento } from '$lib/domain/types/Consentimiento';
import { esTipoConsentimientoCanonico } from '$lib/domain/types/Consentimiento';

export class RegistrarConsentimiento {
	constructor(private consentimientoRepo: ConsentimientoRepository) {}

	/**
	 * RN: El consentimiento se registra para el usuario autenticado indicado (o el propio actor).
	 * RN: `tipo` debe ser un código canónico; `version` no puede estar vacía.
	 * RN: Idempotencia: si ya existe el mismo tipo y versión para el usuario, se devuelve el existente sin duplicar fila.
	 */
	async execute(
		usuarioId: number,
		actorUserId: number,
		tipo: string,
		version: string
	): Promise<Consentimiento> {
		if (!version || !version.trim()) {
			throw new Error('La versión del consentimiento es obligatoria.');
		}
		if (!esTipoConsentimientoCanonico(tipo)) {
			throw new Error(`Tipo de consentimiento no válido: ${tipo}`);
		}

		const existente = await this.consentimientoRepo.findByUsuarioTipoVersion(
			usuarioId,
			tipo,
			version.trim()
		);
		if (existente) {
			return existente;
		}

		return this.consentimientoRepo.create(
			{
				tipo: tipo as Consentimiento['tipo'],
				version: version.trim(),
				usuario_id: usuarioId
			},
			actorUserId
		);
	}
}
