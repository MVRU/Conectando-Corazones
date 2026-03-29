import type { Reporte } from '$lib/domain/types/Reporte';

/**
 * Utilidad para gestionar logs de reportes en el frontend y llamar a la API real.
 */

const STORAGE_KEY = 'cc:reportes:logs';

interface ReporteLog {
	userId: number;
	tipoObjeto: 'Usuario' | 'Proyecto';
	idObjeto: number;
	timestamp: string;
}

/**
 * Verifica si el usuario actual ya reportó un objeto específico basándose en el cache local.
 */
export function haReportado(
	userId: number | undefined,
	tipoObjeto: 'Usuario' | 'Proyecto',
	idObjeto: number | undefined
): boolean {
	if (!userId || !idObjeto) return false;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return false;

		const reportes: ReporteLog[] = JSON.parse(stored);
		return reportes.some(
			(r) => r.userId === userId && r.tipoObjeto === tipoObjeto && r.idObjeto === idObjeto
		);
	} catch {
		return false;
	}
}

/**
 * Guarda un log local para deshabilitar botones de reporte inmediatamente sin esperar a recargar data de la DB.
 */
export function guardarReporteLog(
	userId: number,
	tipoObjeto: 'Usuario' | 'Proyecto',
	idObjeto: number
): void {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		const reportes: ReporteLog[] = stored ? JSON.parse(stored) : [];

		if (
			!reportes.some(
				(r) => r.userId === userId && r.tipoObjeto === tipoObjeto && r.idObjeto === idObjeto
			)
		) {
			reportes.push({
				userId,
				tipoObjeto,
				idObjeto,
				timestamp: new Date().toISOString()
			});
			localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes));
		}
	} catch (error) {
		console.warn('No se pudo guardar el log de reporte localmente', error);
	}
}

/**
 * Elimina un log local de reporte. Útil para sincronizar con el servidor si sabemos que ya no está pendiente.
 */
export function limpiarReporteLog(
	userId: number,
	tipoObjeto: 'Usuario' | 'Proyecto',
	idObjeto: number
): void {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return;

		const reportes: ReporteLog[] = JSON.parse(stored);
		const filtrados = reportes.filter(
			(r) => !(r.userId === userId && r.tipoObjeto === tipoObjeto && r.idObjeto === idObjeto)
		);

		if (filtrados.length !== reportes.length) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
		}
	} catch (error) {
		console.warn('No se pudo limpiar el log de reporte localmente', error);
	}
}

/**
 * Crea un nuevo reporte llamando a la API real.
 */
export async function crearReporte(
	datosReporte: Omit<Reporte, 'id_reporte' | 'created_at' | 'estado'>
): Promise<Reporte> {
	const response = await fetch('/api/reportes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(datosReporte)
	});

	const result = await response.json();

	if (!response.ok || !result.success) {
		throw new Error(result.error || 'Error al enviar el reporte.');
	}

	// Registrar localmente para feedback inmediato en la UI
	guardarReporteLog(
		datosReporte.reportante_id,
		datosReporte.tipo_objeto,
		datosReporte.id_objeto
	);

	return result.reporte as Reporte;
}

