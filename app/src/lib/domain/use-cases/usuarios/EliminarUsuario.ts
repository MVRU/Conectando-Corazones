import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';

export class EliminarUsuario {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(id: number): Promise<void> {
		const usuario = await this.usuarioRepository.findById(id);
		if (!usuario) {
			throw new Error('Usuario no encontrado.');
		}

		await this.usuarioRepository.delete(id);
	}
}
