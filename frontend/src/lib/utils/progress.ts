/**
 * * DECISIÓN DE DISEÑO:
 *     -*- Centralizamos el cálculo del porcentaje de avance de un proyecto.
 *     -*- Se consideran tanto los objetivos cumplidos como el tiempo transcurrido.
 */

import type { Proyecto } from '$lib/types/Proyecto';
import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';

/**
 * Calcula el porcentaje de cumplimiento de los objetivos
 * promediando el cumplimiento individual de cada uno.
 */
export function calcularProgresoCantidad(participaciones: ParticipacionPermitida[] = []): number {
    if (participaciones.length === 0) return 0;

    // Filtramos solo participaciones válidas (> 0)
    const participacionesValidas = participaciones.filter((p) => (p.objetivo ?? 0) > 0);

    if (participacionesValidas.length === 0) return 0;

    const totalObjetivo = participacionesValidas.reduce((acc, p) => acc + (p.objetivo ?? 0), 0);

    if (totalObjetivo === 0) return 0;

    const totalActual = participacionesValidas.reduce((acc, p) => acc + (p.actual ?? 0), 0);

    return Math.min((totalActual / totalObjetivo) * 100, 100);
}


/**
 * Calcula el porcentaje de tiempo transcurrido desde la fecha de inicio hasta la fecha de cierre.
 */
export function calcularProgresoTiempo(fechaInicio?: string, fechaCierre?: string): number {
    if (!fechaInicio || !fechaCierre) return 0;

    const inicio = new Date(fechaInicio).getTime();
    const fin = new Date(fechaCierre).getTime();
    const ahora = Date.now();

    if (isNaN(inicio) || isNaN(fin) || fin <= inicio) return 0;
    if (ahora < inicio) return 0;
    if (ahora > fin) return 100;

    const progreso = (ahora - inicio) / (fin - inicio);
    return progreso * 100;
}

/**
 * Calcula el porcentaje total de progreso combinando avance en cantidad y tiempo.
 */
export function calcularProgresoTotal(proyecto: Proyecto): number {
    const cantidad = calcularProgresoCantidad(proyecto.participacion_permitida || []);
    const tiempo = calcularProgresoTiempo(proyecto.created_at?.toString(), proyecto.fecha_fin_tentativa?.toString());

    return Math.round(0.6 * cantidad + 0.4 * tiempo);
}
