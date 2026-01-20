/**
 * * DECISIÓN DE DISEÑO:
 *     -*- Utilidades centralizadas para manejo de archivos y URLs de almacenamiento.
 *     -*- Facilita el reuso de funciones para formateo, detección de tipos y manejo de Google Drive.
 */

import type { Archivo } from '$lib/types/Archivo';

/**
 * Formatea el tamaño de un archivo en bytes a una representación legible
 * @param bytes - Tamaño en bytes (opcional)
 * @returns String formateado (ej: "240.0 KB", "1.5 MB")
 */
export function formatearTamaño(bytes?: number): string {
	if (!bytes) return 'Tamaño desconocido';
	
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Obtiene la extensión del archivo desde tipo_mime o URL
 * @param tipoMime - Tipo MIME del archivo (ej: "image/jpeg")
 * @param url - URL del archivo como fallback
 * @returns Extensión en mayúsculas (ej: "JPG", "PDF")
 */
export function obtenerExtension(tipoMime?: string, url?: string): string {
	if (tipoMime) {
		const partes = tipoMime.split('/');
		if (partes.length > 1) {
			const extension = partes[1].split(';')[0].toUpperCase();
			if (extension === 'JPEG') return 'JPG';
			return extension;
		}
	}
	// Fallback: intentar obtener de la URL
	if (url) {
		const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
		return match ? match[1].toUpperCase() : 'ARCHIVO';
	}
	return 'ARCHIVO';
}

/**
 * Determina si un archivo es una imagen basándose en su tipo MIME
 * @param tipoMime - Tipo MIME del archivo
 * @returns true si es una imagen
 */
export function esImagen(tipoMime?: string): boolean {
	return tipoMime?.startsWith('image/') ?? false;
}

/**
 * Determina si un archivo es un PDF basándose en su tipo MIME
 * @param tipoMime - Tipo MIME del archivo
 * @returns true si es un PDF
 */
export function esPDF(tipoMime?: string): boolean {
	return tipoMime === 'application/pdf';
}

/**
 * Extrae el ID de archivo de una URL de Google Drive
 * @param url - URL de Google Drive
 * @returns ID del archivo o null si no es una URL válida de Google Drive
 */
export function obtenerIdGoogleDrive(url: string): string | null {
	// Formato: https://drive.google.com/file/d/FILE_ID/view
	// Formato: https://drive.google.com/open?id=FILE_ID
	const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
	if (match1) return match1[1];
	
	const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
	if (match2) return match2[1];
	
	return null;
}

/**
 * Obtiene la URL de descarga directa para un archivo de Google Drive
 * @param fileId - ID del archivo en Google Drive
 * @returns URL de descarga
 */
export function obtenerUrlDescargaGoogleDrive(fileId: string): string {
	return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Obtiene la URL de preview para un archivo de Google Drive
 * @param fileId - ID del archivo en Google Drive
 * @returns URL de preview (útil para PDFs en iframes)
 */
export function obtenerUrlPreviewGoogleDrive(fileId: string): string {
	return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Obtiene la URL de visualización para un archivo de Google Drive
 * @param fileId - ID del archivo en Google Drive
 * @returns URL de visualización (útil para imágenes)
 */
export function obtenerUrlVisualizacionGoogleDrive(fileId: string): string {
	return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Descarga un archivo, manejando Google Drive y otros servicios
 * @param archivo - Objeto Archivo con la información del archivo
 * @returns Promise que se resuelve cuando se completa la descarga o apertura
 */
export async function descargarArchivo(archivo: Archivo): Promise<void> {
	const driveId = obtenerIdGoogleDrive(archivo.url);
	
	// Si es Google Drive, usar URL de descarga directa
	if (driveId) {
		const downloadUrl = obtenerUrlDescargaGoogleDrive(driveId);
		const link = document.createElement('a');
		link.href = downloadUrl;
		link.download = archivo.descripcion || `archivo_${archivo.id_archivo || 'descarga'}`;
		link.target = '_blank';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		return;
	}

	// Para otros servicios, intentar descargar usando fetch
	try {
		const response = await fetch(archivo.url, {
			mode: 'cors',
			credentials: 'omit'
		});
		if (!response.ok) throw new Error('Error al obtener el archivo');
		
		const blob = await response.blob();
		const blobUrl = URL.createObjectURL(blob);
		
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = archivo.descripcion || `archivo_${archivo.id_archivo || 'descarga'}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		// Limpiar el blob URL después de un tiempo
		setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
	} catch (error) {
		// Si falla (por CORS u otro motivo), abrir en nueva pestaña
		console.warn('No se pudo descargar directamente, abriendo en nueva pestaña:', error);
		window.open(archivo.url, '_blank');
	}
}

/**
 * Abre un archivo en una nueva pestaña, manejando Google Drive y otros servicios
 * @param archivo - Objeto Archivo con la información del archivo
 */
export function abrirArchivo(archivo: Archivo): void {
	const driveId = obtenerIdGoogleDrive(archivo.url);
	const esPDFArchivo = esPDF(archivo.tipo_mime);
	const esImagenArchivo = esImagen(archivo.tipo_mime);
	
	// Si es Google Drive, usar URL de preview/visualización según el tipo
	if (driveId) {
		if (esPDFArchivo) {
			window.open(obtenerUrlPreviewGoogleDrive(driveId), '_blank');
		} else if (esImagenArchivo) {
			window.open(obtenerUrlVisualizacionGoogleDrive(driveId), '_blank');
		} else {
			window.open(archivo.url, '_blank');
		}
	} else {
		window.open(archivo.url, '_blank');
	}
}
