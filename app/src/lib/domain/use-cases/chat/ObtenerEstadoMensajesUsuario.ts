import type { ChatRepository } from '$lib/domain/repositories/ChatRepository';

export class ObtenerEstadoMensajesUsuario {
	constructor(private repositorioChat: ChatRepository) {}

	async ejecutar(idUsuario: number): Promise<{ ultimoMensajeAjenoAt: string | null }> {
		const fecha = await this.repositorioChat.obtenerFechaUltimoMensajeAjeno(idUsuario);
		return { ultimoMensajeAjenoAt: fecha?.toISOString() ?? null };
	}
}
