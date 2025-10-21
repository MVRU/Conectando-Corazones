/**
 * Utilidades para colores y estilos de UI
 * Funciones únicas para colores de contactos y roles de usuario
 */

/**
 * Obtiene las clases CSS para colorear un contacto según su tipo y etiqueta
 * @param tipo - Tipo de contacto (telefono, email, web, red_social)
 * @param etiqueta - Etiqueta del contacto (principal, secundario, celular, etc.)
 * @returns Clases CSS de Tailwind para el color
 */
export function obtenerColorContacto(tipo: string, etiqueta?: string): string {
	switch (tipo) {
		case 'telefono':
			if (etiqueta === 'celular') return 'bg-green-100 text-green-800';
			if (etiqueta === 'celular secundario') return 'bg-emerald-100 text-emerald-800';
			return 'bg-blue-100 text-blue-800';
		case 'email':
			return 'bg-purple-100 text-purple-800';
		case 'web':
			return 'bg-orange-100 text-orange-800';
		case 'red_social':
			return 'bg-pink-100 text-pink-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}

/**
 * Obtiene las clases CSS para colorear el rol de usuario
 * @param rol - Rol del usuario (colaborador, institucion, administrador)
 * @returns Clases CSS de Tailwind para el color
 */
export function obtenerColorRol(rol: string): string {
	switch (rol) {
		case 'colaborador':
			return 'bg-green-100 text-green-800';
		case 'institucion':
			return 'bg-blue-100 text-blue-800';
		case 'administrador':
			return 'bg-red-100 text-red-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
}

/**
 * Formatea el texto de un contacto para mostrar de manera legible
 * @param tipo - Tipo de contacto
 * @param etiqueta - Etiqueta del contacto
 * @param valor - Valor del contacto
 * @returns Texto formateado
 */
export function formatearContacto(tipo: string, etiqueta?: string, valor?: string): string {
	const tipoFormateado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
	const etiquetaFormateada = etiqueta ? ` (${etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1)})` : '';
	return `${tipoFormateado}${etiquetaFormateada}: ${valor || ''}`;
}