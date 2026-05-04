import type { Verificacion } from '$lib/domain/types/Verificacion';

export type EstadoVerificacionDisplay =
	| 'sin_verificacion'
	| 'verificacion_pendiente'
	| 'verificacion_rechazada'
	| 'verificado_email_institucional'
	| 'verificado_documental'
	| 'verificado_renaper';

import type { Usuario } from '$lib/domain/types/Usuario';

function obtenerUltimaVerificacion(verificaciones: Verificacion[]): Verificacion | null {
	if (!verificaciones?.length) return null;

	const getFechaMs = (v: Verificacion) => {
		if (!v.created_at) return 0;
		return v.created_at instanceof Date ? v.created_at.getTime() : new Date(v.created_at).getTime();
	};

	const sorted = [...verificaciones].sort((a, b) => {
		const diffFecha = getFechaMs(b) - getFechaMs(a);
		if (diffFecha !== 0) return diffFecha;
		return (b.id_verificacion ?? 0) - (a.id_verificacion ?? 0);
	});

	return sorted[0] ?? null;
}

// Determina qué badge mostrar según las verificaciones del usuario
export function determinarEstadoVerificacion(
	verificaciones: Verificacion[],
	usuario?: Usuario
): EstadoVerificacionDisplay {
	// 1. Prioridad: última verificación registrada
	const ultima = obtenerUltimaVerificacion(verificaciones ?? []);
	if (ultima) {
		if (ultima.estado === 'aprobada') {
			switch (ultima.tipo) {
				case 'renaper':
					return 'verificado_renaper';
				case 'documental':
					return 'verificado_documental';
				case 'email_institucional':
					return 'verificado_email_institucional';
				default:
					return 'verificado_documental';
			}
		}
		if (ultima.estado === 'pendiente') return 'verificacion_pendiente';
		if (ultima.estado === 'rechazada') return 'verificacion_rechazada';
	}

	// 2. Fallback: Atributo directo en usuario (para simplificar migraciones/cálculos)
	if (usuario?.estado_verificacion === 'aprobada') {
		// Retornamos un valor por defecto seguro, ya que "aprobada" genérico
		// podría implicar documental para instituciones.
		return 'verificado_documental';
	}
	if (usuario?.estado_verificacion === 'pendiente') return 'verificacion_pendiente';
	if (usuario?.estado_verificacion === 'rechazada') return 'verificacion_rechazada';

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
