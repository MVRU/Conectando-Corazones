import type { ContactoRepository } from '$lib/domain/repositories/ContactoRepository';

export class EliminarContacto {
	constructor(private contactoRepo: ContactoRepository) {}

	/**
	 * RN: Solo el dueño o administrador puede eliminar un contacto.
	 * RN: No se puede eliminar el único email del usuario (requisito de login por username).
	 */
	async execute(idContacto: number, actorUserId: number, actorRol: string): Promise<void> {
		const actual = await this.contactoRepo.findById(idContacto);
		if (!actual || !actual.usuario_id) {
			throw new Error('Contacto no encontrado.');
		}

		if (actorRol !== 'administrador' && actual.usuario_id !== actorUserId) {
			throw new Error('No tenés permisos para eliminar este contacto.');
		}

		if (actual.tipo_contacto === 'email') {
			const todos = await this.contactoRepo.findByUsuario(actual.usuario_id);
			const emails = todos.filter((c) => c.tipo_contacto === 'email');
			if (emails.length <= 1) {
				throw new Error(
					'No podés eliminar el único email del usuario; el inicio de sesión con nombre de usuario lo requiere.'
				);
			}
		}

		await this.contactoRepo.delete(idContacto, actorUserId);
	}
}
