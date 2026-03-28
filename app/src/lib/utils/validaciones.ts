/**
 * ! Mensajes de error comunes para validaciones
 */

export const MENSAJES_ERROR = {
	obligatorio: 'Este campo es obligatorio',
	correoInvalido: 'Ingresá un correo electrónico válido (ej: tu@correo.com)',
	requisitosContrasena: 'La contraseña debe tener al menos: 1 mayúscula, 1 minúscula y 1 número',
	usuarioInvalido: 'Usá entre 3 y 30 caracteres (letras, números, puntos, guiones bajos o guiones)',
	contrasenasNoCoinciden: 'Las contraseñas no coinciden',
	requisitoEdad: 'Debés ser mayor de 18 años para registrarte',
	tipoInstitucionObligatorio: 'Debés seleccionar un tipo de institución',
	nombreInvalido: 'Ingresá un nombre válido (solo letras y espacios)',
	apellidoInvalido: 'Ingresá un apellido válido (solo letras y espacios)',
	calleInvalida: 'Ingresá una dirección válida',
	numeroCalleInvalido: 'Ingresá un número válido',
	provinciaInvalida: 'Seleccioná una provincia',
	ciudadNoPerteneceProvincia: 'La ciudad seleccionada no coincide con la provincia',
	otroContactoObligatorio: 'Seleccioná un método de contacto',
	telefonoInvalido: 'Ingresá un número de teléfono válido',
	urlInvalida: 'Ingresá una URL válida (ej: https://ejemplo.com)',
	contactoDuplicado: 'Este método de contacto ya existe',
	fechaInvalida: 'Fecha inválida',
	fechaFutura: 'La fecha no puede ser en el futuro',
	fechaMuyAntigua: 'La fecha es demasiado antigua',
	nombreLegalDuplicado: 'El nombre legal ya se encuentra registrado',
	nombreCorto: 'El nombre debe tener al menos 3 caracteres',
	razonSocialDuplicada: 'La razón social ya se encuentra registrada',
	fechaFinObligatoria: 'La fecha de fin es obligatoria',
	fechaFinFutura: 'La fecha de fin debe ser en el futuro',
	fechaLejana: 'La fecha es demasiado lejana',
	imagenUrlInvalida: 'La imagen debe ser: JPG, PNG, WebP o GIF',
	especieObligatoria: 'Seleccioná un ítem',
	beneficiariosNoReducir: 'El número de beneficiarios no puede reducirse',
	objetivoNoReducir: 'El objetivo no puede ser menor al actual',
	fechaNoAnterior: 'Solo podés extender la fecha'
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
export function formatearFecha(fecha?: Date | string, formato: 'short' | 'long' = 'short'): string {
	if (!fecha) return 'No especificada';

	try {
		const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);

		if (isNaN(fechaObj.getTime())) {
			return 'Fecha inválida';
		}

		return fechaObj.toLocaleDateString('es-AR', {
			day: '2-digit',
			month: formato === 'long' ? 'long' : '2-digit',
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

/**
 * Parsea una fecha en formato DD/MM/YYYY a un objeto Date
 * Retorna null si el formato es inválido
 */
export function parsearFechaDDMMYYYY(input: string): Date | null {
	const trimmed = input.trim();
	const parts = trimmed.split('/');

	if (parts.length !== 3) return null;

	const day = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10);
	const year = parseInt(parts[2], 10);

	if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

	// Crear la fecha
	const date = new Date(year, month - 1, day);

	// Validar que sea una fecha válida (month y day correctos)
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
		return null;
	}

	return date;
}

/**
 * Valida una fecha de nacimiento con reglas estrictas
 * Retorna el error específico o empty string si es válido
 */
export function validarFechaNacimiento(fecha: Date | null): string {
	if (!fecha || !(fecha instanceof Date) || isNaN(fecha.getTime())) {
		return MENSAJES_ERROR.fechaInvalida;
	}

	// No permitir fechas futuras
	const ahora = new Date();
	ahora.setHours(0, 0, 0, 0);
	const fechaCopia = new Date(fecha);
	fechaCopia.setHours(0, 0, 0, 0);

	if (fechaCopia > ahora) {
		return MENSAJES_ERROR.fechaFutura;
	}

	// Validar que sea mayor de 18 años
	if (!esAdulto(fecha)) {
		return MENSAJES_ERROR.requisitoEdad;
	}

	return '';
}
