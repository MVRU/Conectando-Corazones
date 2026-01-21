import type { Verificacion } from '$lib/domain/types/Verificacion';

export type EstadoVerificacionDisplay =
	| 'sin_verificacion'
	| 'verificacion_pendiente'
	| 'verificado_email_institucional'
	| 'verificado_documental'
	| 'verificado_renaper';

// Determina qué badge mostrar según las verificaciones del usuario
export function determinarEstadoVerificacion(
	verificaciones: Verificacion[]
): EstadoVerificacionDisplay {
	if (!verificaciones || verificaciones.length === 0) {
		return 'sin_verificacion';
	}

	// Si tiene alguna aprobada, mostramos la de mayor nivel
	const aprobada = verificaciones.find((v) => v.estado === 'aprobada');
	if (aprobada) {
		switch (aprobada.tipo) {
			case 'renaper':
				return 'verificado_renaper';
			case 'documental':
				return 'verificado_documental';
			case 'email_institucional':
				return 'verificado_email_institucional';
		}
	}

	// Si no tiene aprobadas pero sí pendientes
	if (verificaciones.some((v) => v.estado === 'pendiente')) {
		return 'verificacion_pendiente';
	}

	return 'sin_verificacion';
}

// Filtra las verificaciones de un usuario específico
export function obtenerVerificacionesUsuario(
	usuarioId: number | undefined,
	mockVerificaciones: Verificacion[]
): Verificacion[] {
	if (!usuarioId) return [];
	return mockVerificaciones.filter((v) => v.usuario_id === usuarioId);
}
