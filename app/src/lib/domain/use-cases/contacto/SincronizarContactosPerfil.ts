import type { ContactoRepository } from '$lib/domain/repositories/ContactoRepository';
import { Contacto } from '$lib/domain/entities/Contacto';
import { validarListaContactosPerfil } from './validar-contactos-perfil';

export class SincronizarContactosPerfil {
	constructor(private contactoRepo: ContactoRepository) {}

	/**
	 * RN: Solo el dueño del perfil o un administrador puede reemplazar la lista de contactos.
	 * RN: Debe existir al menos un contacto tipo `email` válido (login por username resuelve el correo desde contactos).
	 * RN: No se permiten duplicados (mismo tipo + mismo valor); formatos según tipo (email, teléfono, URL).
	 */
	async execute(
		usuarioPerfilId: number,
		actorUserId: number,
		actorRol: string,
		contactosInput: Array<{ tipo_contacto: string; valor: string; etiqueta?: string | null }>
	): Promise<Contacto[]> {
		if (actorRol !== 'administrador' && actorUserId !== usuarioPerfilId) {
			throw new Error('No tenés permisos para modificar los contactos de este usuario.');
		}

		const entidades = contactosInput.map(
			(c) =>
				new Contacto({
					tipo_contacto: c.tipo_contacto,
					valor: c.valor,
					etiqueta: c.etiqueta
				})
		);

		validarListaContactosPerfil(entidades);

		return this.contactoRepo.replaceAllForUsuario(usuarioPerfilId, entidades, actorUserId);
	}
}
