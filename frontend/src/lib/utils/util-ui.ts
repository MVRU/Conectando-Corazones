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

/**
 * Formatea la etiqueta de un contacto para mostrar de manera legible
 * @param etiqueta - Etiqueta del contacto (principal, secundario, celular, etc.)
 * @returns Etiqueta formateada
 */
export function formatearEtiquetaContacto(etiqueta?: string): string {
	if (!etiqueta) return '';
	const etiquetas: Record<string, string> = {
		'principal': 'Principal',
		'secundario': 'Secundario',
		'celular': 'Celular',
		'celular secundario': 'Celular Secundario',
		'fijo': 'Fijo',
		'oficina': 'Oficina'
	};
	return etiquetas[etiqueta.toLowerCase()] || etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
}

/**
 * Obtiene el path del SVG para el icono de un tipo de contacto
 * @param tipo - Tipo de contacto (email, telefono, web, red_social)
 * @returns Path del SVG para el icono
 */
export function obtenerIconoContacto(tipo: string): string {
	switch (tipo) {
		case 'email':
			return 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
		case 'telefono':
			return 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
		case 'web':
			return 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9';
		case 'red_social':
			return 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1';
		default:
			return 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z';
	}
}