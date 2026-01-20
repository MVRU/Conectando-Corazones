import type { Reporte } from '$lib/domain/types/Reporte';
import { mockReportes } from '$lib/mocks/mock-reportes';

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

	// Revisar mocks (Simulación de Backend)
	// Buscamos si existe un reporte PENDIENTE de este usuario para este proyecto
	const reportePendienteMock = mockReportes.some(
		(r) =>
			r.reportante_id === userId &&
			r.tipo_objeto === 'Proyecto' &&
			r.id_objeto === proyectoId &&
			r.estado === 'pendiente'
	);

	if (reportePendienteMock) return true;

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
	const nuevoId = Math.max(...mockReportes.map((r) => r.id_reporte || 0), 0) + 1;

	const nuevoReporte: Reporte = {
		...datosReporte,
		id_reporte: nuevoId,
		created_at: new Date(),
		estado: 'pendiente'
	};

	// Guardar en "Base de datos" (Mock en memoria)
	mockReportes.push(nuevoReporte);

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
	if (typeof localStorage === 'undefined') return;

	try {
		const storedReportes = localStorage.getItem(LOCAL_REPORTES_KEY);
		if (storedReportes) {
			const reportes: Reporte[] = JSON.parse(storedReportes);
			// Mezclar con mocks si no existen ya (evitar duplicados de ID si se reinicia el mock estático)
			reportes.forEach((r) => {
				if (!mockReportes.some((mr) => mr.id_reporte === r.id_reporte)) {
					// Convertir fechas string a Date
					r.created_at = new Date(r.created_at!);
					if (r.fecha_resolucion) r.fecha_resolucion = new Date(r.fecha_resolucion);
					mockReportes.push(r);
				}
			});
		}
	} catch (e) {
		console.error('Error cargando reportes persistidos', e);
	}
}
