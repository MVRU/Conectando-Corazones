import type { Colaboracion } from '$lib/types/Colaboracion';
import type { ColaboradorDisyuncion } from '$lib/types/Usuario';

/**
 * * Retorna el nombre visible de un colaborador
 * @param colaborador - Datos del colaborador (puede ser undefined)
 */
export function obtenerNombreColaborador(colaborador?: ColaboradorDisyuncion): string {
	if (!colaborador) return 'Colaborador';
	if ('razon_social' in colaborador && colaborador.razon_social) {
		return colaborador.razon_social;
	}
	return `${colaborador.nombre} ${colaborador.apellido}`.trim() || 'Colaborador';
}

/**
 * * Filtra colaboraciones con estado visible en frontend
 * @param colaboraciones - Lista de colaboraciones del proyecto
 */
export function colaboracionesVisibles(colaboraciones: Colaboracion[] = []): Colaboracion[] {
	return colaboraciones.filter((c) => c.estado === 'pendiente' || c.estado === 'aprobada');
}

/**
 * * Devuelve un icono según el tipo de colaborador
 */
export function getTipoIcon(colaboracion: Colaboracion): string {
	if (
		colaboracion.colaborador &&
		'tipo_colaborador' in colaboracion.colaborador &&
		colaboracion.colaborador.tipo_colaborador === 'organizacion'
	) {
		return '🏢';
	}
	return '👤';
}

/**
 * * Etiqueta legible del tipo de colaborador
 */
export function getTipoLabel(colaboracion: Colaboracion): string {
	if (!colaboracion.colaborador) return 'Colaborador';
	if (
		'tipo_colaborador' in colaboracion.colaborador &&
		colaboracion.colaborador.tipo_colaborador === 'organizacion'
	) {
		return 'Organización';
	}
	return 'Persona';
}

/**
 * * Contadores útiles de colaboraciones
 */
export const getColaboracionesCount = (proyecto: { colaboraciones?: Colaboracion[] }): number =>
	proyecto.colaboraciones?.length || 0;

export const getColaboracionesPendientes = (proyecto: {
	colaboraciones?: Colaboracion[];
}): number => proyecto.colaboraciones?.filter((c) => c.estado === 'pendiente')?.length || 0;

export const getColaboracionesAprobadas = (proyecto: {
	colaboraciones?: Colaboracion[];
}): number => proyecto.colaboraciones?.filter((c) => c.estado === 'aprobada')?.length || 0;

/**
 * * Calcula días desde la fecha dada hasta hoy
 */
export function calcularDiasActivo(fecha: Date | undefined): number {
	if (!fecha) return 0;
	const fechaCreacion = new Date(fecha);
	const hoy = new Date();
	const diferencia = hoy.getTime() - fechaCreacion.getTime();
	return Math.floor(diferencia / (1000 * 3600 * 24));
}