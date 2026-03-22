import type { ContactoRepository } from '$lib/domain/repositories/ContactoRepository';
import { Contacto } from '$lib/domain/entities/Contacto';
import { esTipoContactoCanonico } from '$lib/domain/types/Contacto';
import {
	MENSAJES_ERROR,
	validarCorreo,
	validarTelefonoInternacional,
	validarUrl
} from '$lib/utils/validaciones';

export class ActualizarContacto {
	constructor(private contactoRepo: ContactoRepository) {}

	/**
	 * RN: Solo el dueño o administrador puede actualizar un contacto.
	 * RN: Si se elimina el único email del usuario (por cambio de tipo), debe quedar otro email en el perfil.
	 */
	async execute(
		idContacto: number,
		actorUserId: number,
		actorRol: string,
		data: Partial<Pick<Contacto, 'tipo_contacto' | 'valor' | 'etiqueta'>>
	): Promise<Contacto> {
		const actual = await this.contactoRepo.findById(idContacto);
		if (!actual || !actual.usuario_id) {
			throw new Error('Contacto no encontrado.');
		}

		if (actorRol !== 'administrador' && actual.usuario_id !== actorUserId) {
			throw new Error('No tenés permisos para modificar este contacto.');
		}

		const tieneCambios =
			data.tipo_contacto !== undefined ||
			data.valor !== undefined ||
			data.etiqueta !== undefined;
		if (!tieneCambios) {
			throw new Error('No se indicaron campos a actualizar.');
		}

		const nuevoTipo = data.tipo_contacto ?? actual.tipo_contacto;
		const nuevoValor = data.valor !== undefined ? data.valor : actual.valor;

		if (data.tipo_contacto !== undefined && !esTipoContactoCanonico(data.tipo_contacto)) {
			throw new Error(`Tipo de contacto no válido: ${data.tipo_contacto}`);
		}

		this.validarValorPorTipo(nuevoTipo, nuevoValor);

		const seraEmail = nuevoTipo === 'email';
		if (actual.tipo_contacto === 'email' && !seraEmail) {
			const todos = await this.contactoRepo.findByUsuario(actual.usuario_id);
			const otrosEmails = todos.filter(
				(c) => c.id_contacto !== idContacto && c.tipo_contacto === 'email'
			);
			if (otrosEmails.length === 0) {
				throw new Error(
					'No podés dejar al usuario sin ningún email; agregá otro contacto email antes de cambiar este.'
				);
			}
		}

		return this.contactoRepo.update(
			idContacto,
			{
				tipo_contacto: data.tipo_contacto,
				valor: data.valor,
				etiqueta: data.etiqueta
			},
			actorUserId
		);
	}

	private validarValorPorTipo(tipo: string, valor: string) {
		const v = valor.trim();
		switch (tipo) {
			case 'email':
				if (!validarCorreo(v)) throw new Error(MENSAJES_ERROR.correoInvalido);
				break;
			case 'telefono':
				if (!validarTelefonoInternacional(v)) throw new Error(MENSAJES_ERROR.telefonoInvalido);
				break;
			case 'web':
			case 'red_social':
				if (!validarUrl(v)) throw new Error(MENSAJES_ERROR.urlInvalida);
				break;
			default:
				break;
		}
	}
}
