/**
 * Utilidades para manejo de perfiles de usuario
 */

import type { Proyecto } from '$lib/types/Proyecto';
import type { Usuario, Institucion, ColaboradorDisyuncion } from '$lib/types/Usuario';

/**
 * Verifica si el usuario actual puede ver los contactos del perfil visitado
 * según las reglas de colaboración establecidas.
 *
 * Reglas:
 * - Si es el propio perfil, siempre puede ver
 * - Si el perfil es de una Institución: el colaborador actual debe tener al menos una
 *   solicitud de colaboración aprobada en algún proyecto de esa institución
 * - Si el perfil es de un Colaborador: el usuario actual debe tener al menos una
 *   solicitud de colaboración aprobada en un proyecto donde el colaborador del perfil
 *   también tiene una colaboración aprobada
 *
 * @param usuarioActual - Usuario que está visitando el perfil (puede ser null si no está autenticado)
 * @param perfilUsuario - Usuario cuyo perfil se está viendo
 * @param proyectos - Lista de todos los proyectos disponibles
 * @returns true si puede ver los contactos, false en caso contrario
 */
export function puedeVerContactos(
	usuarioActual: Usuario | null,
	perfilUsuario: Usuario,
	proyectos: Proyecto[]
): boolean {
	// Si no hay usuario autenticado, no puede ver contactos
	if (!usuarioActual) {
		return false;
	}

	// Si es su propio perfil, siempre puede ver
	if (usuarioActual.id_usuario === perfilUsuario.id_usuario) {
		return true;
	}

	// Si el perfil es de una Institución
	if (perfilUsuario.rol === 'institucion') {
		return tieneColaboracionConInstitucion(
			usuarioActual.id_usuario!,
			perfilUsuario.id_usuario!,
			proyectos
		);
	}

	// Si el perfil es de un Colaborador
	if (perfilUsuario.rol === 'colaborador') {
		// Si el usuario actual es una institución
		if (usuarioActual.rol === 'institucion') {
			return tieneColaboracionConInstitucion(
				perfilUsuario.id_usuario!,
				usuarioActual.id_usuario!,
				proyectos
			);
		}
		// Si el usuario actual es también colaborador
		return tienenColaboracionEnComun(
			usuarioActual.id_usuario!,
			perfilUsuario.id_usuario!,
			proyectos
		);
	}

	// Por defecto, no puede ver
	return false;
}

/**
 * Verifica si un colaborador tiene al menos una colaboración aprobada
 * en algún proyecto de una institución específica
 
 * @param colaboradorId - ID del colaborador
 * @param institucionId - ID de la institución
 * @param proyectos - Lista de proyectos
 * @returns true si tiene colaboración aprobada
 */
function tieneColaboracionConInstitucion(
	colaboradorId: number,
	institucionId: number,
	proyectos: Proyecto[]
): boolean {
	// Buscar proyectos de la institución
	const proyectosInstitucion = proyectos.filter((p) => p.institucion_id === institucionId);

	// Verificar si el colaborador tiene alguna colaboración aprobada en esos proyectos
	return proyectosInstitucion.some((proyecto) =>
		proyecto.colaboraciones?.some(
			(colab) => colab.colaborador_id === colaboradorId && colab.estado === 'aprobada'
		)
	);
}

/**
 * Verifica si dos colaboradores tienen al menos una colaboración aprobada
 * en el mismo proyecto
 *
 * @param colaboradorId1 - ID del primer colaborador
 * @param colaboradorId2 - ID del segundo colaborador
 * @param proyectos - Lista de proyectos
 * @returns true si tienen colaboración en común
 */
function tienenColaboracionEnComun(
	colaboradorId1: number,
	colaboradorId2: number,
	proyectos: Proyecto[]
): boolean {
	// Buscar proyectos donde ambos colaboradores tienen colaboración aprobada
	return proyectos.some((proyecto) => {
		const colaboraciones = proyecto.colaboraciones || [];

		const tieneColab1 = colaboraciones.some(
			(c) => c.colaborador_id === colaboradorId1 && c.estado === 'aprobada'
		);
		const tieneColab2 = colaboraciones.some(
			(c) => c.colaborador_id === colaboradorId2 && c.estado === 'aprobada'
		);

		return tieneColab1 && tieneColab2;
	});
}

export function puedeDejarResena(
	usuarioActual: Usuario | null,
	perfilUsuario: Usuario,
	proyectos: Proyecto[]
): boolean {
	if (!usuarioActual) {
		return false;
	}
	if (usuarioActual.id_usuario === perfilUsuario.id_usuario) {
		return false;
	}
	if (perfilUsuario.rol === 'institucion') {
		if (usuarioActual.rol === 'colaborador') {
			return tieneColaboracionConInstitucion(
				usuarioActual.id_usuario!,
				perfilUsuario.id_usuario!,
				proyectos
			);
		}
		return false;
	}
	if (perfilUsuario.rol === 'colaborador') {
		if (usuarioActual.rol === 'institucion') {
			return tieneColaboracionConInstitucion(
				perfilUsuario.id_usuario!,
				usuarioActual.id_usuario!,
				proyectos
			);
		}
		if (usuarioActual.rol === 'colaborador') {
			return tienenColaboracionEnComun(
				usuarioActual.id_usuario!,
				perfilUsuario.id_usuario!,
				proyectos
			);
		}
	}
	return false;
}

export function obtenerUrlPerfil(
	usuario?: Usuario | Institucion | ColaboradorDisyuncion | { username?: string }
): string | null {
	if (!usuario || !usuario.username) return null;
	return `/perfil/${usuario.username}`;
}

export function obtenerUsernameDeInstitucion(institucion?: Institucion): string | null {
	return institucion?.username || null;
}

export function obtenerUsernameDeColaborador(colaborador?: ColaboradorDisyuncion): string | null {
	return colaborador?.username || null;
}
