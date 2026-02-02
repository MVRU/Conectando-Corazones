import type { Usuario } from '$lib/domain/entities/Usuario';
import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';

export class AutenticarUsuario {
	constructor(private usuarioRepo: UsuarioRepository) {}

	async execute(username: string, passwordPlain: string): Promise<Usuario | null> {
		const usuario = await this.usuarioRepo.findByUsername(username);

		if (!usuario || !usuario.password) {
			return null;
		}

		const isMatch = await bcrypt.compare(passwordPlain, usuario.password);
		if (!isMatch) {
			return null;
		}

		return usuario;
	}
}
