// import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
import type { Usuario, Institucion } from '$lib/domain/types/Usuario';

/**
 * Obtiene el nombre completo de un usuario por su ID
 * @param usuarioId - ID del usuario
 * @returns Nombre completo del usuario o 'Usuario desconocido' si no existe
 */
export function obtenerNombreUsuario(usuarioId: number): string {
	// TODO: Esta función dependía de un mock global.
	// Debería ser reemplazada por `obtenerNombreCompleto` pasando el objeto usuario,
	// o obteniendo el usuario desde el backend/store donde sea necesario.
	return `Usuario #${usuarioId}`;
}

/**
 * Obtiene el nombre completo de un usuario a partir de su objeto
 * @param usuario - Objeto del usuario
 * @returns Nombre completo del usuario
 */
export function obtenerNombreCompleto(usuario: Usuario): string {
	const u = usuario as any;
	if (u.rol === 'institucion' && u.nombre_legal) {
		return u.nombre_legal;
	}

	if (u.tipo_colaborador === 'organizacion' && u.razon_social) {
		return u.razon_social;
	}

	return `${u.nombre} ${u.apellido}`.trim() || u.username;
}

/**
 * Obtiene las iniciales de un usuario por su ID
 * @param usuarioId - ID del usuario
 * @returns Iniciales del usuario (2 letras)
 */
export function obtenerInicialesUsuario(usuarioId: number): string {
	const nombre = obtenerNombreUsuario(usuarioId);

	if (nombre === 'Usuario desconocido') return 'UD';

	const palabras = nombre.split(' ');
	if (palabras.length === 1) {
		return palabras[0].substring(0, 2).toUpperCase();
	}

	return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
}
