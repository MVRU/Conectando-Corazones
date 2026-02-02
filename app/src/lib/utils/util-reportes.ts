import type { Reporte } from '$lib/domain/types/Reporte';
// import { mockReportes } from '$lib/infrastructure/mocks/mock-reportes';

/**
 * Utilidad para simular la persistencia de reportes en el frontend.
 * Permite "recordar" si un usuario ya reportó un proyecto para deshabilitar el botón.
 */

const STORAGE_KEY = 'cc:reportes:mock';
const LOCAL_REPORTES_KEY = 'cc:reportes:data'; // Persistencia de los reportes creados

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

/**
 * Crea un nuevo reporte y lo guarda simulando un backend.
 * Actualiza tanto el mock en memoria (para la sesión actual) como localStorage (para persistencia simple).
 */
export async function crearReporte(
	datosReporte: Omit<Reporte, 'id_reporte' | 'created_at' | 'estado'>
): Promise<Reporte> {
	await new Promise((resolve) => setTimeout(resolve, 800));

	// Crear el objeto Reporte completo
	const nuevoId = Math.floor(Date.now() / 1000);

	const nuevoReporte: Reporte = {
		...datosReporte,
		id_reporte: nuevoId,
		created_at: new Date(),
		estado: 'pendiente'
	};

	// Persistir en localStorage para que sobreviva recargas (para demos)
	try {
		const storedReportes = localStorage.getItem(LOCAL_REPORTES_KEY);
		const reportesPersistidos: Reporte[] = storedReportes ? JSON.parse(storedReportes) : [];
		reportesPersistidos.push(nuevoReporte);
		localStorage.setItem(LOCAL_REPORTES_KEY, JSON.stringify(reportesPersistidos));

		// También registrar que el usuario ya reportó este objeto (para deshabilitar botón)
		if (datosReporte.tipo_objeto === 'Proyecto') {
			guardarReporteLog(datosReporte.reportante_id, datosReporte.id_objeto);
		}
	} catch (e) {
		console.error('Error persistiendo reporte en localStorage', e);
	}

	console.log('Reporte creado exitosamente (Simulado):', nuevoReporte);
	return nuevoReporte;
}

// Función auxiliar para cargar reportes persistidos al iniciar la app
export function cargarReportesPersistidos(): void {
	// Deprecated: No se cargan mocks globales
}
