import type { Verificacion } from '$lib/domain/types/Verificacion';

export type EstadoVerificacionDisplay =
	| 'sin_verificacion'
	| 'verificacion_pendiente'
	| 'verificado_email_institucional'
	| 'verificado_documental'
	| 'verificado_renaper';

import type { Usuario } from '$lib/domain/types/Usuario';

// Determina qué badge mostrar según las verificaciones del usuario
export function determinarEstadoVerificacion(
	verificaciones: Verificacion[],
	usuario?: Usuario
): EstadoVerificacionDisplay {
	// 1. Prioridad: Verificaciones explícitas aprobadas
	if (verificaciones && verificaciones.length > 0) {
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
	}

	// 2. Fallback: Atributo directo en usuario (para simplificar migraciones/cálculos)
	if (usuario?.estado_verificacion === 'aprobada') {
		// Retornamos un valor por defecto seguro, ya que "aprobada" genérico
		// podría implicar documental para instituciones.
		return 'verificado_documental';
	}

	// 3. Si no tiene aprobadas pero sí pendientes
	if (verificaciones && verificaciones.some((v) => v.estado === 'pendiente')) {
		return 'verificacion_pendiente';
	}

	return 'sin_verificacion';
}

export function esInstitucionVerificada(
	usuario?: Usuario | null,
	verificaciones?: Verificacion[]
): boolean {
	if (!usuario) return false;
	if (usuario.estado_verificacion === 'aprobada') return true;
	if (verificaciones?.some((v) => v.estado === 'aprobada')) return true;
	// También revisamos si las verificaciones ya vienen dentro del objeto usuario
	if ((usuario as any).verificaciones?.some((v: any) => v.estado === 'aprobada')) return true;
	return false;
}

// Filtra las verificaciones de un usuario específico
export function obtenerVerificacionesUsuario(
	usuarioId: number | undefined,
	mockVerificaciones: Verificacion[]
): Verificacion[] {
	if (!usuarioId) return [];
	return mockVerificaciones.filter((v) => v.usuario_id === usuarioId);
}
