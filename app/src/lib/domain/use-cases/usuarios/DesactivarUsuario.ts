import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import type { Usuario } from '$lib/domain/entities/Usuario';

type EstadoUsuario = 'activo' | 'inactivo' | 'suspendido';

export class DesactivarUsuario {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(id: number, estado: EstadoUsuario): Promise<Usuario> {
		const usuario = await this.usuarioRepository.findById(id);
		if (!usuario) {
			throw new Error('Usuario no encontrado.');
		}

		usuario.estado = estado;
		usuario.validarInvariantes();

		return await this.usuarioRepository.update(usuario);
	}
}
