import { mockUsuarios } from '$lib/mocks/mock-usuarios';
import type { Usuario, Institucion } from '$lib/types/Usuario';

/**
 * Obtiene el nombre completo de un usuario por su ID
 * @param usuarioId - ID del usuario
 * @returns Nombre completo del usuario o 'Usuario desconocido' si no existe
 */
export function obtenerNombreUsuario(usuarioId: number): string {
	const usuarios = Object.values(mockUsuarios);
	const user = usuarios.find((u) => u.id_usuario === usuarioId);

	if (!user) return 'Usuario desconocido';

	// Si es institución, retornar el nombre legal (nombre oficial de la institución)
	if ('nombre_legal' in user) {
		return (user as Institucion).nombre_legal;
	}

	// Si es usuario individual (colaborador/admin), retornar nombre y apellido
	return `${user.nombre} ${user.apellido}`;
}

/**
 * Obtiene el nombre completo de un usuario a partir de su objeto
 * @param usuario - Objeto del usuario
 * @returns Nombre completo del usuario
 */
export function obtenerNombreCompleto(usuario: Usuario): string {
	if ('nombre_legal' in usuario) {
		return (usuario as Institucion).nombre_legal;
	}
	return `${usuario.nombre} ${usuario.apellido}`;
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
