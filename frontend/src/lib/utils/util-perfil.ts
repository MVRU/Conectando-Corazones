/**
 * Utilidades para manejo de perfiles de usuario
 */

/**
 * Oculta datos sensibles de un contacto para mostrar en perfiles públicos
 * @param valor - Valor del contacto (email, teléfono, etc.)
 * @param tipo - Tipo de contacto
 * @returns Valor oculto parcialmente
 */
export function ocultarDatoSensible(valor: string, tipo: string): string {
	if (!valor) return 'No disponible';

	switch (tipo) {
		case 'email': {
			const [nombre, dominio] = valor.split('@');
			if (!dominio) return valor;
			const nombreOculto = nombre.length > 2 
				? nombre.substring(0, 2) + '***' 
				: '***';
			return `${nombreOculto}@${dominio}`;
		}
		case 'telefono': {
			// Ocultar todos los dígitos excepto los últimos 4
			const soloNumeros = valor.replace(/\D/g, '');
			if (soloNumeros.length <= 4) return '***';
			const ultimos4 = soloNumeros.slice(-4);
			return `***${ultimos4}`;
		}
		default:
			return valor;
	}
}

/**
 * Determina si un dato de contacto debe ser ocultado
 * @param tipo - Tipo de contacto
 * @returns true si debe ser ocultado
 */
export function debeOcultarContacto(tipo: string): boolean {
	return tipo === 'email' || tipo === 'telefono';
}

