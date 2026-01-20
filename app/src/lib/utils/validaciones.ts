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
	contrasenasNoCoinciden: 'Las contraseñas no coinciden',
	requisitoEdad: 'Debés tener al menos 18 años',
	tipoInstitucionObligatorio: 'Especificá el tipo de institución',
	nombreInvalido: 'Nombre inválido. Solo se permiten letras y espacios.',
	apellidoInvalido: 'Apellido inválido. Solo se permiten letras y espacios.',
	calleInvalida: 'Calle inválida. Ingresá una dirección válida.',
	numeroCalleInvalido: 'Número inválido. Tiene que ser un número positivo.',
	provinciaInvalida: 'Provincia inválida. Seleccioná una opción.',
	ciudadNoPerteneceProvincia: 'La ciudad seleccionada no pertenece a la provincia elegida.',
	otroContactoObligatorio: 'Especificá el tipo de contacto',
	telefonoInvalido: 'Número de teléfono inválido',
	urlInvalida: 'URL inválida',
	contactoDuplicado: 'Método de contacto duplicado',
	fechaFutura: 'La fecha no puede ser futura',
	fechaMuyAntigua: 'La fecha es demasiado antigua',
	nombreLegalDuplicado: 'El nombre legal ya se encuentra registrado',
	nombreCorto: 'El nombre debe tener al menos 3 caracteres',
	razonSocialDuplicada: 'La razón social ya se encuentra registrada',
	fechaFinObligatoria: 'La fecha de fin es obligatoria.',
	fechaFinFutura: 'La fecha de fin tiene que ser futura.',
	fechaLejana: 'La fecha es demasiado lejana.',
	imagenUrlInvalida: 'La URL debe apuntar a una imagen (.jpg, .jpeg, .png, .webp, .gif)',
	especieObligatoria: 'Especificá el ítem.',
	beneficiariosNoReducir: 'El número de beneficiarios no puede reducirse.',
	objetivoNoReducir: 'El objetivo no puede ser menor al actual.',
	fechaNoAnterior: 'Solo podés extender la fecha.'
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
	return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(nombre.trim());
}

export function validarApellido(apellido: string): boolean {
	return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(apellido.trim());
}

export function validarNombreLegal(nombre: string): boolean {
	const nombreNormalizado = nombre.trim();
	return nombreNormalizado.length >= 3;
}

export function validarCalle(calle: string): boolean {
	return calle.trim().length >= 3;
}

export function validarNumeroCalle(numero: string): boolean {
	const trim = numero.trim();
	// Permitir números (1-5 dígitos) o texto corto alfanumérico como "S/N"
	return trim.length > 0 && trim.length <= 10 && /^[a-zA-Z0-9\s/.-]+$/.test(trim);
}

export function validarProvincia(provincia: string): boolean {
	return provincias.some((p) => p.nombre === provincia);
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
	return regexTelefono.test(telefono.replace(/\s|-|\(|\)/g, ''));
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

export function esFechaMuyAntigua(fecha?: Date | string): boolean {
	if (!fecha) return false;

	try {
		const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
		if (isNaN(fechaObj.getTime())) return false;

		const fechaActual = new Date();
		const diferenciaAnios = fechaActual.getFullYear() - fechaObj.getFullYear();

		return diferenciaAnios > 120;
	} catch {
		return false;
	}
}

// Verifica que fecha_entrada <= fecha_salida.
export function validarCoherenciaTemporal(
	fechaEntrada?: Date | string | null,
	fechaSalida?: Date | string | null
): boolean {
	if (!fechaEntrada || !fechaSalida) return false;

	try {
		const fechaEntradaObj = fechaEntrada instanceof Date ? fechaEntrada : new Date(fechaEntrada);
		const fechaSalidaObj = fechaSalida instanceof Date ? fechaSalida : new Date(fechaSalida);

		// Validar que las fechas sean válidas antes de comparar
		const entradaValida = !isNaN(fechaEntradaObj.getTime());
		const salidaValida = !isNaN(fechaSalidaObj.getTime());

		if (!entradaValida || !salidaValida) {
			return false;
		}

		// La fecha de entrada debe ser menor o igual a la fecha de salida
		return fechaEntradaObj <= fechaSalidaObj;
	} catch {
		return false;
	}
}
