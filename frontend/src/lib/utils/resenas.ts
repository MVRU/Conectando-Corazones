import type { Resena } from '$lib/types/Resena';

/**
 * Verifica si un usuario ya reseñó un objeto específico
 */
export function yaReseno(usuario: string, reseñas: Resena[], tipoObjeto: string, idObjeto?: number): boolean {
	return reseñas.some(r => 
		r.username === usuario && 
		r.tipo_objeto === tipoObjeto && 
		(idObjeto === undefined || r.id_objeto === idObjeto)
	);
}

/**
 * Filtra reseñas por tipo de objeto
 */
export function filtrarResenasPorTipo(reseñas: Resena[], tipoObjeto: string, idObjeto?: number): Resena[] {
	return reseñas.filter(r => 
		r.tipo_objeto === tipoObjeto && 
		(idObjeto === undefined || r.id_objeto === idObjeto)
	);
}

/**
 * Calcula el puntaje promedio de un conjunto de reseñas
 */
export function calcularPuntajePromedio(reseñas: Resena[]): number {
	if (reseñas.length === 0) return 0;
	const suma = reseñas.reduce((acc, r) => acc + r.puntaje, 0);
	return Math.round((suma / reseñas.length) * 10) / 10; // Redondea a 1 decimal
}

/**
 * Obtiene el texto del placeholder según el tipo de objeto
 */
export function obtenerPlaceholderResena(tipoObjeto: string): string {
	const placeholders = {
		usuario: 'Comparte tu experiencia con este usuario...',
		proyecto: 'Comparte tu experiencia con este proyecto...',
		institucion: 'Comparte tu experiencia con esta institución...'
	};
	return placeholders[tipoObjeto as keyof typeof placeholders] || 'Comparte tu experiencia...';
}

/**
 * Obtiene el título del modal según el tipo de objeto
 */
export function obtenerTituloResena(tipoObjeto: string): string {
	const titulos = {
		usuario: 'Reseñar Usuario',
		proyecto: 'Reseñar Proyecto',
		institucion: 'Reseñar Institución'
	};
	return titulos[tipoObjeto as keyof typeof titulos] || 'Añadir Reseña';
}
