import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import type { Usuario } from '$lib/domain/entities/Usuario';

export class ObtenerUsuario {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(id: number | undefined): Promise<Usuario | null> {
		if (!id) return null;
		return await this.usuarioRepository.findById(id);
	}

	async porUsername(username: string): Promise<Usuario | null> {
		if (!username) return null;
		return await this.usuarioRepository.findByUsername(username);
	}

	async porEmail(email: string): Promise<Usuario | null> {
		if (!email) return null;
		return await this.usuarioRepository.findByEmail(email);
	}
}
