import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import bcrypt from 'bcryptjs';

export class CambiarContrasena {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(input: { userId: number; nuevaContrasena: string }): Promise<void> {
		if (!input.nuevaContrasena || input.nuevaContrasena.length < 8) {
			throw new Error('La contraseña debe tener al menos 8 caracteres.');
		}

		const usuario = await this.usuarioRepository.findById(input.userId);
		if (!usuario) {
			throw new Error('Usuario no encontrado.');
		}

		const salt = await bcrypt.genSalt(10);
		usuario.password = await bcrypt.hash(input.nuevaContrasena, salt);

		await this.usuarioRepository.update(usuario);
	}
}
