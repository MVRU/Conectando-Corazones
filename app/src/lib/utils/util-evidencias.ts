import type { ParticipacionPermitida } from '$lib/domain/types/ParticipacionPermitida';
import type { Evidencia } from '$lib/domain/types/Evidencia';

/**
 * Agrupa evidencias por su respectivo objetivo del proyecto
 * @param participaciones - Lista de participaciones (objetivos) permitidas del proyecto
 * @param evidencias - Lista total de evidencias recolectadas
 */
export function agruparEvidenciasPorObjetivo(
	participaciones: ParticipacionPermitida[] = [],
	evidencias: Evidencia[] = []
) {
	return (
		participaciones.map((objetivo) => {
			const evidenciasObjetivo =
				evidencias.filter(
					(e) => e.id_participacion_permitida === objetivo.id_participacion_permitida
				) || [];

			// Separar evidencias de entrada y salida
			const evidenciasEntrada = evidenciasObjetivo.filter((e) => e.tipo_evidencia === 'entrada');
			const evidenciasSalida = evidenciasObjetivo.filter((e) => e.tipo_evidencia === 'salida');

			return {
				objetivo,
				evidencias: evidenciasObjetivo,
				evidenciasEntrada,
				evidenciasSalida,
				totalArchivos: evidenciasObjetivo.reduce((sum, ev) => sum + (ev.archivos?.length || 0), 0)
			};
		}) || []
	);
}
