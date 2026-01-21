// * DECISIÓN DE DISEÑO: esta capa traduce los formularios de registro en los inputs esperados por authStore,
// * evitando dependencias directas de la UI con Firebase y habilitando pruebas unitarias.

/**
 * TODOS:
 * - [ ] Agregar inputs a auth.
 */

import type { Contacto } from '$lib/domain/types/Contacto';
import type {
	ColaboradorFormSubmitDetail,
	InstitucionFormSubmitDetail,
	RegistroCuentaSubmitDetail
} from '$lib/domain/types/forms/registro';
import type { RegisterColaboradorInput, RegisterInstitucionInput } from '$lib/stores/auth';

interface RegistroMapeado<TInput> {
	input: TInput;
	emailPrincipal: string;
}

function sanitizarCadena(valor: unknown): string {
	return typeof valor === 'string' ? valor.trim() : '';
}

function sanitizarCadenaOpcional(valor: unknown): string | undefined {
	const limpio = sanitizarCadena(valor);
	return limpio.length > 0 ? limpio : undefined;
}

function normalizarEmail(email: string): string {
	return sanitizarCadena(email).toLowerCase();
}

function clonarContactos(contactos: Contacto[] = []): Contacto[] {
	return contactos.map((contacto) => ({ ...contacto }));
}

function obtenerEmailPrincipal(contactos: Contacto[]): string | null {
	for (const contacto of contactos) {
		if (!contacto) continue;
		const valor = sanitizarCadena(contacto.valor);
		if (!valor) continue;
		const tipo = sanitizarCadena(contacto.tipo_contacto || 'email').toLowerCase();
		const etiqueta = sanitizarCadena(contacto.etiqueta || 'principal').toLowerCase();
		if (tipo.includes('mail') && etiqueta === 'principal') {
			return valor.toLowerCase();
		}
	}
	return null;
}

function construirMetadatos(base: Record<string, unknown>): Record<string, unknown> | undefined {
	const entradas = Object.entries(base).filter(([, valor]) => valor !== undefined);
	if (entradas.length === 0) {
		return undefined;
	}
	return Object.fromEntries(entradas);
}

function normalizarDetalleColaborador(
	detalle: ColaboradorFormSubmitDetail | RegistroCuentaSubmitDetail
): ColaboradorFormSubmitDetail {
	if ('rol' in detalle) {
		if (detalle.rol !== 'colaborador') {
			throw new Error('El detalle recibido no corresponde a un colaborador.');
		}
		return {
			colaborador: detalle.payload.colaborador,
			organizacion: detalle.payload.organizacion,
			archivoFoto: detalle.archivoFoto
		};
	}
	return detalle;
}

function normalizarDetalleInstitucion(
	detalle: InstitucionFormSubmitDetail | RegistroCuentaSubmitDetail
): InstitucionFormSubmitDetail {
	if ('rol' in detalle) {
		if (detalle.rol !== 'institucion') {
			throw new Error('El detalle recibido no corresponde a una institución.');
		}
		return {
			institucion: detalle.payload.institucion,
			archivoFoto: detalle.archivoFoto
		};
	}
	return detalle;
}

export function mapearFormularioColaboradorAInputRegistro(
	detalle: ColaboradorFormSubmitDetail | RegistroCuentaSubmitDetail
): RegistroMapeado<RegisterColaboradorInput> {
	const normalizado = normalizarDetalleColaborador(detalle);
	const contactos = clonarContactos(normalizado.colaborador.contactos);
	const email = obtenerEmailPrincipal(contactos);
	if (!email) {
		throw new Error('No pudimos identificar un correo electrónico principal válido.');
	}

	const metadatos = construirMetadatos({
		organizacion:
			normalizado.colaborador.tipo_colaborador === 'organizacion'
				? {
						razon_social: sanitizarCadena(normalizado.organizacion.razon_social),
						con_fines_de_lucro: normalizado.organizacion.con_fines_de_lucro
					}
				: undefined,
		fotoPerfilPendiente: normalizado.archivoFoto ? true : undefined
	});

	const datosRegistro: RegisterColaboradorInput = {
		email: normalizarEmail(email),
		password: normalizado.colaborador.password,
		perfil: {
			username: sanitizarCadena(normalizado.colaborador.username),
			nombre: sanitizarCadena(normalizado.colaborador.nombre),
			apellido: sanitizarCadena(normalizado.colaborador.apellido),
			fecha_nacimiento: normalizado.colaborador.fecha_nacimiento,
			url_foto: sanitizarCadena(normalizado.colaborador.url_foto),
			contactos,
			tipo_colaborador: normalizado.colaborador.tipo_colaborador
		},
		metadata: metadatos
	};

	return {
		input: datosRegistro,
		emailPrincipal: email
	};
}

export function mapearFormularioInstitucionAInputRegistro(
	detalle: InstitucionFormSubmitDetail | RegistroCuentaSubmitDetail
): RegistroMapeado<RegisterInstitucionInput> {
	const normalizado = normalizarDetalleInstitucion(detalle);
	const contactos = clonarContactos(normalizado.institucion.contactos);
	const email = obtenerEmailPrincipal(contactos);
	if (!email) {
		throw new Error('No pudimos identificar un correo electrónico principal válido.');
	}

	const metadatos = construirMetadatos({
		fotoPerfilPendiente: normalizado.archivoFoto ? true : undefined
	});

	const tipoInstitucion =
		sanitizarCadenaOpcional(normalizado.institucion.tipo_institucion) ?? 'otro';
	const datosRegistro: RegisterInstitucionInput = {
		email: normalizarEmail(email),
		password: normalizado.institucion.password,
		perfil: {
			username: sanitizarCadena(normalizado.institucion.username),
			nombre: sanitizarCadena(normalizado.institucion.nombre),
			apellido: sanitizarCadena(normalizado.institucion.apellido),
			fecha_nacimiento: normalizado.institucion.fecha_nacimiento,
			url_foto: sanitizarCadena(normalizado.institucion.url_foto),
			contactos,
			nombre_legal:
				sanitizarCadenaOpcional(normalizado.institucion.nombre_legal) ??
				sanitizarCadena(normalizado.institucion.nombre),
			tipo_institucion: tipoInstitucion
		},
		metadata: metadatos
	};

	return {
		input: datosRegistro,
		emailPrincipal: email
	};
}
