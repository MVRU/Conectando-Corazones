import type { Reporte } from '$lib/domain/types/Reporte';

/**
 * Utilidad para reportes en frontend.
 * Mantiene un log local para deshabilitar duplicados de reportes en UI.
 */

const STORAGE_KEY = 'cc:reportes:mock';
const LOCAL_REPORTES_KEY = 'cc:reportes:data';

interface ReporteLog {
	userId: number;
	proyectoId: number;
	timestamp: string;
}

export function haReportado(userId: number | undefined, proyectoId: number | undefined): boolean {
	if (!userId || !proyectoId) return false;

	// Revisar localStorage (Persistencia local del cliente)
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return false;

		const reportes: ReporteLog[] = JSON.parse(stored);
		return reportes.some((r) => r.userId === userId && r.proyectoId === proyectoId);
	} catch {
		return false;
	}
}

export function guardarReporteLog(userId: number, proyectoId: number): void {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		const reportes: ReporteLog[] = stored ? JSON.parse(stored) : [];

		// Evitar duplicados exactos por seguridad
		if (!reportes.some((r) => r.userId === userId && r.proyectoId === proyectoId)) {
			reportes.push({
				userId,
				proyectoId,
				timestamp: new Date().toISOString()
			});
			localStorage.setItem(STORAGE_KEY, JSON.stringify(reportes));
		}
	} catch (error) {
		console.warn('No se pudo guardar el log de reporte localmente', error);
	}
}

export async function crearReporte(
	datosReporte: Omit<Reporte, 'id_reporte' | 'created_at' | 'estado'>
): Promise<Reporte> {
	const response = await fetch('/api/reportes', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(datosReporte)
	});

	const payload = await response.json().catch(() => null);
	if (!response.ok) {
		throw new Error(payload?.error || 'No se pudo crear el reporte.');
	}

	const creado: Reporte = payload;

	try {
		const storedReportes = localStorage.getItem(LOCAL_REPORTES_KEY);
		const reportesPersistidos: Reporte[] = storedReportes ? JSON.parse(storedReportes) : [];
		reportesPersistidos.push(creado);
		localStorage.setItem(LOCAL_REPORTES_KEY, JSON.stringify(reportesPersistidos));
		if (datosReporte.tipo_objeto === 'Proyecto') {
			guardarReporteLog(datosReporte.reportante_id, datosReporte.id_objeto);
		}
	} catch {
		// Persistencia local opcional: si falla, no frena el flujo principal.
	}

	return creado;
}

// Función auxiliar para cargar reportes persistidos al iniciar la app
export function cargarReportesPersistidos(): void {
	// Deprecated: No se cargan mocks globales
}
