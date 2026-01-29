import type { Usuario } from '$lib/domain/entities/Usuario';
import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';

export class RegistrarUsuario {
	constructor(private usuarioRepo: UsuarioRepository) {}

	async execute(usuario: Usuario): Promise<Usuario> {
		if (usuario.password) {
			const salt = await bcrypt.genSalt(10);
			usuario.password = await bcrypt.hash(usuario.password, salt);
		}

		return this.usuarioRepo.create(usuario);
	}
}
