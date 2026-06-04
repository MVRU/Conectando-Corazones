import { ESTADO_LABELS, type EstadoDescripcion } from '$lib/domain/types/Estado';

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

export function getEstadoCodigo(estado?: EstadoDescripcion, id_estado?: number): EstadoDescripcion {
	if (estado) return estado;
	if (id_estado && ESTADO_POR_ID[id_estado]) return ESTADO_POR_ID[id_estado];
	return 'en_curso';
}

export const estadoLabel = (codigo: EstadoDescripcion) => ESTADO_LABELS[codigo];

export function getColorEstadoHex(estado: string): string {
	const colores: Record<string, string> = {
		en_curso: '#10b981',
		pendiente_solicitud_cierre: '#f59e0b',
		en_revision: '#3b82f6',
		en_auditoria: '#8b5cf6',
		completado: '#6b7280',
		cancelado: '#ef4444',
		borrador: '#64748b'
	};
	return colores[estado] ?? '#6b7280';
}
