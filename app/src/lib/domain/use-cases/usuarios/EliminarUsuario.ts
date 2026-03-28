import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';

export class EliminarUsuario {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(id: number): Promise<void> {
		const usuario = await this.usuarioRepository.findById(id);
		if (!usuario) {
			throw new Error('Usuario no encontrado.');
		}

		// RN 1.3 - No permitir eliminación si hay proyectos en curso
		if (usuario.esInstitucion()) {
			const hasActiveProjects = await this.usuarioRepository.hasActiveProjects(id);
			if (hasActiveProjects) {
				throw new Error('No se puede eliminar la institución porque tiene proyectos en curso.');
			}
		}

		// RN 1.3 - No permitir eliminación si hay colaboraciones activas
		const hasActiveCollaborations = await this.usuarioRepository.hasActiveCollaborations(id);
		if (hasActiveCollaborations) {
			throw new Error('No se puede eliminar el usuario porque tiene colaboraciones activas en proyectos en curso.');
		}

		await this.usuarioRepository.delete(id);
	}
}
