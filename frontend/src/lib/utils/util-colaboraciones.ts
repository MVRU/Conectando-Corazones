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