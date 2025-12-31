// FIX: revisar y corregir errores tras cambios en interfaces

// TODO: corregir cuando cambiemos el signin (registro de usuario)

import { provincias } from '$lib/data/provincias';
import { mockLocalidades } from '$lib/mocks/mock-localidades';

/**
 * ! Mensajes de error comunes para validaciones
 */

export const MENSAJES_ERROR = {
	obligatorio: 'Este campo es obligatorio',
	correoInvalido: 'Por favor, ingresá un correo electrónico válido',
	requisitosContrasena:
		'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
	usuarioInvalido:
		'El nombre de usuario debe tener entre 3 y 30 caracteres y solo puede contener letras, números, puntos, guiones bajos o guiones',
	cuitInvalid: 'El CUIT es inválido', // ! Quitar cuando corrijamos signin
	cuilInvalid: 'El CUIL es inválido', // ! Quitar cuando corrijamos signin
	contrasenasNoCoinciden: 'Las contraseñas no coinciden',
	requisitoEdad: 'Debés tener al menos 18 años',
	documentTypeRequired: 'Por favor, especificá el tipo de documento', // ! Quitar cuando corrijamos signin
	tipoInstitucionObligatorio: 'Debe especificar el tipo de institución',
	specifyDocument: 'Debe especificar el documento', // ! Quitar cuando corrijamos signin
	nombreInvalido: 'Nombre inválido. Solo se permiten letras y espacios.',
	apellidoInvalido: 'Apellido inválido. Solo se permiten letras y espacios.',
	dniInvalid: 'DNI inválido. Debe ser un número entre 7 y 8 dígitos.', // ! Quitar cuando corrijamos signin
	calleInvalida: 'Calle inválida. Ingresá una dirección válida.',
	numeroCalleInvalido: 'Número inválido.',
	pisoInvalido: 'Piso inválido. Puede ser un número o "PB".', // ! Este no lo estamos implementando -> revisar
	ciudadInvalida: 'Ciudad inválida. Ingresá un nombre válido.', // ! Este no lo estamos implementando -> revisar
	provinciaInvalida: 'Provincia inválida. Seleccioná una opción.',
	ciudadNoPerteneceProvincia: 'La ciudad seleccionada no pertenece a la provincia elegida.',
	otroContactoObligatorio: 'Debe especificar el tipo de contacto',
	telefonoInvalido: 'Número de teléfono inválido',
	urlInvalida: 'URL inválida',
	contactoDuplicado: 'Método de contacto duplicado'
};

/**
 * ! Funciones de validación
 */

export function validarCorreo(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validarContrasena(contrasena: string): boolean {
	return /[A-Z]/.test(contrasena) && /[a-z]/.test(contrasena) && /[0-9]/.test(contrasena);
}

export function validarUsername(username: string): boolean {
	return /^[a-zA-Z0-9._-]{3,30}$/.test(username);
}

export function isValidCuit(cuit: string): boolean {
	// ! Quitar cuando corrijamos signin
	if (!cuit) return false;
	if (!/^\d{11}$/.test(cuit)) return false;
	const prefix = cuit.slice(0, 2);
	const number = cuit.slice(2, 10);
	const check = cuit.slice(10);
	const digits = prefix + number;
	const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
	let sum = 0;
	for (let i = 0; i < digits.length; i++) {
		sum += parseInt(digits[i]) * weights[i];
	}
	const mod = sum % 11;
	const calculatedCheckDigit = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;
	return check === calculatedCheckDigit.toString();
}

export function isValidCuil(cuil: string): boolean {
	// ! Quitar cuando corrijamos signin
	if (!cuil) return false;
	if (!/^\d{11}$/.test(cuil)) return false;
	const prefix = cuil.slice(0, 2);
	const number = cuil.slice(2, 10);
	const check = cuil.slice(10);
	const digits = prefix + number;
	const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
	let sum = 0;
	for (let i = 0; i < digits.length; i++) {
		sum += parseInt(digits[i]) * weights[i];
	}
	const mod = sum % 11;
	const calculatedCheckDigit = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;
	return check === calculatedCheckDigit.toString();
}

export function esAdulto(fecha: Date): boolean {
	if (!(fecha instanceof Date) || isNaN(fecha.getTime())) return false;
	const hoy = new Date();
	const edad = hoy.getFullYear() - fecha.getFullYear();
	const mes = hoy.getMonth() - fecha.getMonth();
	const dia = hoy.getDate() - fecha.getDate();

	if (fecha > hoy) return false;

	return edad > 18 || (edad === 18 && (mes > 0 || (mes === 0 && dia >= 0)));
}

export function validarNombre(nombre: string): boolean {
	return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre.trim());
}

export function validarApellido(apellido: string): boolean {
	return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido.trim());
}

export function isValidDni(dni: string): boolean {
	// ! Quitar cuando corrijamos signin
	const dniNum = parseInt(dni, 10);
	return /^\d{7,8}$/.test(dni) && dniNum >= 1000000 && dniNum <= 99999999;
}

export function validarRazonSocial(nombre: string): boolean {
	// ! Este no lo estamos implementando -> revisar
	return nombre.trim().length >= 3 && nombre.trim().length <= 100;
}

export function validarCalle(calle: string): boolean {
	return calle.trim().length >= 3;
}

export function validarNumeroCalle(numero: string): boolean {
	const trim = numero.trim();
	// Permitir números (1-5 dígitos) o texto corto alfanumérico como "S/N"
	return trim.length > 0 && trim.length <= 10 && /^[a-zA-Z0-9\s/.-]+$/.test(trim);
}

export function validarPiso(piso: string): string | null {
	if (!piso || !piso.trim()) return null; // Campo opcional
	const v = piso.trim();
	const num = parseInt(v, 10);
	if (isNaN(num) || num < 0 || !Number.isInteger(parseFloat(v))) {
		return 'Ingrese un número de piso válido.';
	}
	return null;
}

export function validarCiudad(ciudad: string): boolean {
	// ! Este no lo estamos implementando -> revisar
	return ciudad.trim().length >= 2;
}

export function validarProvincia(provincia: string): boolean {
	// ! Este no lo estamos implementando -> revisar
	return provincias.some((p) => p.nombre === provincia);
}

export function validarProvinciaPorId(id: number): boolean {
	// ! Este no lo estamos implementando -> revisar
	return provincias.some((p) => p.id_provincia === id);
}

export function validarProvinciaPorISO(codigoIso: string): boolean {
	// ! Este no lo estamos implementando -> revisar
	return provincias.some((p) => p.codigo_iso === codigoIso);
}

/**
 * -!- Valida si una ciudad pertenece a una provincia específica usando IDs.
 */

export function validarCiudadEnProvincia(
	idLocalidad?: number | string,
	idProvincia?: number | string
): boolean {
	const locId = Number(idLocalidad);
	const provId = Number(idProvincia);
	if (!locId || !provId) return false;

	const localidad = mockLocalidades.find((l) => l.id_localidad === locId);
	return localidad?.id_provincia === provId;
}

/**
 * -!- Valida un número de teléfono con prefijo internacional.
 */
export function validarTelefonoInternacional(telefono: string): boolean {
	if (!telefono || !telefono.trim()) return false;

	const regexTelefono = /^\+?\d{1,3}[\s-]?\d{1,4}[\s-]?\d{3}[\s-]?\d{4}$/;
	return regexTelefono.test(telefono.replace(/\s|-|\(|\)/g, '')); // Limpia espacios y formateadores
}

export function validarUrl(url: string): boolean {
	const regexUrl = /^(https?:\/\/)?([\w-])+\.{1}[\w-]+(\.[\w-]+)*(:[0-9]+)?(\/.*)?$/;
	return regexUrl.test(url);
}

/*
Funciones de formateo de fechas
 */
export function formatearFecha(fecha?: Date | string): string {
	if (!fecha) return 'No especificada';

	try {
		const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);

		if (isNaN(fechaObj.getTime())) {
			return 'Fecha inválida';
		}

		return fechaObj.toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	} catch {
		return 'Fecha inválida';
	}
}
export function esFechaFutura(fecha?: Date | string): boolean {
	if (!fecha) return false;

	try {
		const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
		if (isNaN(fechaObj.getTime())) return false;

		return fechaObj > new Date();
	} catch {
		return false;
	}
}
