import type { Estado } from "$lib/types/Estado";
import { ESTADO_LABELS, ESTADOS, type EstadoDescripcion } from '$lib/types/Estado';

export const ESTADO_POR_ID: Record<number, EstadoDescripcion> = {
    1: 'en_curso',
    2: 'pendiente_solicitud_cierre',
    3: 'en_revision',
    4: 'en_auditoria',
    5: 'completado',
    6: 'cancelado'
};

/**
 * * Getters sencillos
 */

// export const getEstado = (id: number) =>
//     ESTADOS.find(({ id_estado }) => id_estado === id);

export function getEstadoCodigo(
    estado?: EstadoDescripcion,
    estado_id?: number
): EstadoDescripcion {
    if (estado) return estado;
    if (estado_id && ESTADO_POR_ID[estado_id]) return ESTADO_POR_ID[estado_id];
    return 'en_curso'; // default sensato
}

export const estadoLabel = (codigo: EstadoDescripcion) => ESTADO_LABELS[codigo];