// * Códigos canónicos
export const ESTADOS = [
	'borrador',
	'en_curso',
	'pendiente_solicitud_cierre',
	'en_revision',
	'en_auditoria',
	'completado',
	'cancelado'
] as const;

export type EstadoDescripcion = (typeof ESTADOS)[number];

// ! Interfaz
export interface Estado {
	id_estado?: number;
	descripcion: EstadoDescripcion;
}

// * Mapa de labels para UI
export const ESTADO_LABELS: Record<EstadoDescripcion, string> = {
	borrador: 'Borrador',
	en_curso: 'En curso',
	pendiente_solicitud_cierre: 'Pendiente de cierre',
	en_revision: 'En revisión',
	en_auditoria: 'En auditoría',
	completado: 'Completado',
	cancelado: 'Cancelado'
};

/**
 * Se usa para filtrar cálculos como "Próximo Cierre" y "Próximos Vencimientos",
 * excluyendo proyectos completados o cancelados.
 */
export const ESTADOS_ACTIVOS_PROYECTO: readonly EstadoDescripcion[] = [
	'en_curso',
	'pendiente_solicitud_cierre',
	'en_revision',
	'en_auditoria'
] as const;
