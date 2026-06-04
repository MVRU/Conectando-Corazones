import type { Verificacion } from '$lib/domain/types/Verificacion';
import { esArcaVigente } from '$lib/domain/types/Verificacion';
import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';
import { TIPOS_PARTICIPACION_DEDUCIBLES } from '$lib/domain/types/TipoParticipacion';

/**
 * Datos necesarios para decidir si un colaborador puede acceder al beneficio fiscal
 */
export interface InputDeduccion {
	/** Código del estado del proyecto (ej.: 'completado'). */
	proyectoEstado: string;
	/** Verificación ARCA más reciente de la institución dueña del proyecto. */
	institucionVerificacionArca?: Verificacion | null;
	/** Si el colaborador autenticado declaró tener fines de lucro. */
	colaboradorConFinesLucro: boolean;
	/** Colaboración del usuario autenticado en este proyecto, con sus tipos de participación. */
	colaboracionDelUsuario?: {
		estado: 'pendiente' | 'aprobada' | 'rechazada' | 'anulada' | string;
		tipos: { descripcion: string }[];
	} | null;
}

export function colaboradorPuedeDeducirEnProyecto(
	input: InputDeduccion,
	hoy: Date = new Date()
): boolean {
	if (input.proyectoEstado !== 'completado') return false;
	if (!input.colaboradorConFinesLucro) return false;
	if (!esArcaVigente(input.institucionVerificacionArca ?? null, hoy)) return false;

	const colaboracion = input.colaboracionDelUsuario;
	if (!colaboracion) return false;
	if (colaboracion.estado !== 'aprobada') return false;

	return colaboracion.tipos.some((t) =>
		TIPOS_PARTICIPACION_DEDUCIBLES.includes(t.descripcion as TipoParticipacionDescripcion)
	);
}
