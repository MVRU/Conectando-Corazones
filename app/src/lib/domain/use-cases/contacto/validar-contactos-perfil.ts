import { esTipoContactoCanonico, esEtiquetaContactoCanonica } from '$lib/domain/types/Contacto';
import {
	MENSAJES_ERROR,
	validarCorreo,
	validarTelefonoInternacional,
	validarUrl
} from '$lib/utils/validaciones';
import type { Contacto } from '$lib/domain/entities/Contacto';

/** Valida lista de contactos antes de persistir (duplicados, formatos, email mínimo para login por username). */
export function validarListaContactosPerfil(contactos: Contacto[]): void {
	if (!contactos || contactos.length === 0) {
		throw new Error('Debés indicar al menos un método de contacto.');
	}

	for (const c of contactos) {
		if (!esTipoContactoCanonico(c.tipo_contacto)) {
			throw new Error(`Tipo de contacto no válido: ${c.tipo_contacto}`);
		}
		if (c.etiqueta && !esEtiquetaContactoCanonica(c.etiqueta)) {
			throw new Error(`Etiqueta de contacto no válida: ${c.etiqueta}`);
		}
	}

	const claves = new Set<string>();
	for (const c of contactos) {
		const clave = `${c.tipo_contacto}:${c.valor.trim().toLowerCase()}`;
		if (claves.has(clave)) {
			throw new Error(MENSAJES_ERROR.contactoDuplicado);
		}
		claves.add(clave);

		switch (c.tipo_contacto) {
			case 'email':
				if (!validarCorreo(c.valor.trim())) {
					throw new Error(MENSAJES_ERROR.correoInvalido);
				}
				break;
			case 'telefono':
				if (!validarTelefonoInternacional(c.valor.trim())) {
					throw new Error(MENSAJES_ERROR.telefonoInvalido);
				}
				break;
			case 'web':
			case 'red_social':
				if (!validarUrl(c.valor.trim())) {
					throw new Error(MENSAJES_ERROR.urlInvalida);
				}
				break;
			default:
				break;
		}
	}

	const emails = contactos.filter((c) => c.tipo_contacto === 'email');
	if (emails.length === 0) {
		throw new Error(
			'Debés mantener al menos un contacto de tipo email (necesario para iniciar sesión con nombre de usuario).'
		);
	}
}
