import type { Consentimiento } from '../types/Consentimiento';

export interface ConsentimientoRepository {
	create(
		consentimiento: Consentimiento & { usuario_id: number },
		actorUserId: number
	): Promise<Consentimiento>;
	findByUsuario(usuarioId: number): Promise<Consentimiento[]>;
	findByUsuarioTipoVersion(
		usuarioId: number,
		tipo: string,
		version: string
	): Promise<Consentimiento | null>;
}
