import type { Usuario } from '$lib/domain/entities/Usuario';
import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';

/**
 * Caso de uso para obtener el usuario de dominio a partir de su identificador de Supabase.
 */
export class ObtenerUsuarioSesion {
	constructor(private usuarioRepo: UsuarioRepository) {}

	/**
	 * Ejecuta la resolución del usuario local a partir del ID de autenticación.
	 *
	 * @param authId UID del usuario en Supabase Auth
	 * @returns El usuario de dominio o null si no se encuentra
	 */
	async execute(authId: string): Promise<Usuario | null> {
		if (!authId) return null;

		try {
			const usuario = await this.usuarioRepo.findByAuthId(authId);

			if (!usuario) {
				console.warn(
					`[ObtenerUsuarioSesion] No se encontró registro local para el AuthID: ${authId}`
				);
				return null;
			}

			return usuario;
		} catch (error) {
			console.error(`[ObtenerUsuarioSesion] Error al buscar usuario por AuthID: ${authId}`, error);
			return null;
		}
	}
}
