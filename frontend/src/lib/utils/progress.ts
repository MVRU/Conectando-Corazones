/**
 * * DECISIÓN DE DISEÑO:
 *     -*- Centralizamos el cálculo del porcentaje de avance de un proyecto.
 *     -*- Se consideran tanto los objetivos cumplidos como el tiempo transcurrido.
 */

import type { Objetivo, Project } from '$lib/types/Project';

/**
 * Calcula el porcentaje de cumplimiento de los objetivos
 * promediando el cumplimiento individual de cada uno.
 */
export function calcularProgresoCantidad(objetivos: Objetivo[] = []): number {
    if (objetivos.length === 0) return 0;

    const sumaProgresos = objetivos.reduce((acc, obj) => {
        const cantidad = obj.cantidad ?? 0;
        const objetivo = obj.objetivo ?? 0;
        if (objetivo === 0) return acc; // Evita división por cero
        return acc + cantidad / objetivo; // Puede superar el 100% si se supera el objetivo
    }, 0);

    return (sumaProgresos / objetivos.length) * 100;
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

    const progreso = (ahora - inicio) / (fin - inicio);
    return Math.min(Math.max(progreso, 0), 1) * 100; // Clamp entre 0 y 100
}

/**
 * Calcula el porcentaje total de progreso combinando avance en cantidad y tiempo.
 */
export function calcularProgresoTotal(proyecto: Project): number {
    const cantidad = calcularProgresoCantidad(proyecto.objetivos);
    const tiempo = calcularProgresoTiempo(proyecto.fechaInicio, proyecto.fechaCierre);

    return Math.round(0.6 * cantidad + 0.4 * tiempo);
}
