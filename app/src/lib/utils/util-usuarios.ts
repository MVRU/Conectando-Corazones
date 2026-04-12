// import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
import type { Usuario } from '$lib/domain/types/Usuario';

export const IMAGEN_USUARIO_FALLBACK = '/users/user-default.png';

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
type UsuarioNombrable = {
	username?: string | null;
	nombre: string;
	apellido: string;
	rol: Usuario['rol'] | string;
	nombre_legal?: string | null;
	tipo_colaborador?: string | null;
	razon_social?: string | null;
};

export function obtenerNombreCompleto(usuario: UsuarioNombrable): string {
	const u = usuario as any;
	if (u.rol === 'institucion' && u.nombre_legal) {
		return u.nombre_legal;
	}

	if (u.tipo_colaborador === 'organizacion' && u.razon_social) {
		return u.razon_social;
	}

	return `${u.nombre} ${u.apellido}`.trim() || u.username;
}

export function obtenerRolVisibleUsuario(rol: Usuario['rol'] | string | undefined): string {
	return rol === 'institucion' ? 'Institución' : 'Colaborador';
}

export function obtenerHrefPerfilPublico(username: string | null | undefined): string | null {
	if (!username?.trim()) {
		return null;
	}

	return `/perfil/${username}`;
}

export function obtenerRutaPanelPorRol(rol: Usuario['rol'] | undefined): string {
	switch (rol) {
		case 'institucion':
			return '/institucion/mi-panel';
		case 'colaborador':
			return '/colaborador/mi-panel';
		case 'administrador':
			return '/admin';
		default:
			return '/';
	}
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
