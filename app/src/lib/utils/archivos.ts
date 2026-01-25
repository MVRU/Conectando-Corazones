import { FileText, Image as ImageIcon, type Icon } from 'lucide-svelte';

/**
 * Obtiene el icono correspondiente según el tipo MIME del archivo.
 * @param tipoMime El tipo MIME del archivo (ej: 'application/pdf', 'image/jpeg').
 * @returns El componente de icono correspondiente (FileText o ImageIcon).
 */
export function obtenerIconoArchivo(tipoMime: string | undefined): typeof Icon {
	return tipoMime?.includes('pdf') ? FileText : ImageIcon;
}

/**
 * Formatea un tamaño en bytes a una cadena legible (MB, KB, etc.).
 * @param bytes El tamaño en bytes.
 * @param decimales El número de decimales a mostrar (por defecto 1).
 * @returns Una cadena con el tamaño formateado (ej: '1.5 MB').
 */
export function formatearBytes(bytes: number | undefined, decimales: number = 1): string {
	if (bytes === undefined || bytes === null) return 'Desconocido';
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimales)) + ' ' + sizes[i];
}

/**
 * Determina el tipo visual del archivo ('pdf' o 'image') basado en su tipo MIME.
 * Útil para lógica de visualización en componentes.
 * @param tipoMime El tipo MIME del archivo.
 * @returns 'pdf' si es PDF, 'image' si es imagen, o 'unknown' si no se reconoce.
 */
export function obtenerTipoVisual(tipoMime: string | undefined): 'pdf' | 'image' | 'unknown' {
	if (tipoMime?.includes('pdf')) return 'pdf';
	if (tipoMime?.startsWith('image/')) return 'image';
	return 'unknown';
}
