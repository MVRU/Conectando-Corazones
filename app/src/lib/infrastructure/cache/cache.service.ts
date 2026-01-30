/**
 * Servicio de caché en memoria simple para datos estáticos
 * Útil para categorías, provincias, tipos de participación, etc.
 */

interface CacheItem<T> {
	data: T;
	expires: number;
}

export class CacheService {
	private static instance: CacheService;
	private cache = new Map<string, CacheItem<any>>();

	private constructor() {}

	static getInstance(): CacheService {
		if (!CacheService.instance) {
			CacheService.instance = new CacheService();
		}
		return CacheService.instance;
	}

	/**
	 * Obtiene un valor del caché
	 * @param key Clave del caché
	 * @returns El valor cacheado o null si expiró o no existe
	 */
	get<T>(key: string): T | null {
		const item = this.cache.get(key);
		if (!item) return null;

		// Verificar si expiró
		if (Date.now() > item.expires) {
			this.cache.delete(key);
			return null;
		}

		return item.data as T;
	}

	/**
	 * Guarda un valor en el caché
	 * @param key Clave del caché
	 * @param data Datos a cachear
	 * @param ttlMs Tiempo de vida en milisegundos (default: 5 minutos)
	 */
	set<T>(key: string, data: T, ttlMs: number = 300000): void {
		this.cache.set(key, {
			data,
			expires: Date.now() + ttlMs
		});
	}

	/**
	 * Invalida una entrada del caché
	 * @param key Clave a invalidar
	 */
	invalidate(key: string): void {
		this.cache.delete(key);
	}

	/**
	 * Invalida todas las entradas que coincidan con un patrón
	 * @param pattern Patrón de búsqueda (ej: 'proyectos:*')
	 */
	invalidatePattern(pattern: string): void {
		const regex = new RegExp(pattern.replace('*', '.*'));
		for (const key of this.cache.keys()) {
			if (regex.test(key)) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Limpia todo el caché
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Obtiene estadísticas del caché
	 */
	getStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys())
		};
	}
}

// Exportar instancia singleton
export const cache = CacheService.getInstance();
