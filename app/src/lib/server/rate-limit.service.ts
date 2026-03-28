import { cache } from '$lib/infrastructure/cache/cache.service';

export interface RateLimitConfig {
	/** Máximo de intentos por ventana */
	maxAttempts: number;
	/** Ventana de tiempo en milisegundos */
	windowMs: number;
	/** Claves adicionales a rastrear (p. ej., email para limitación por usuario) */
	keyPrefix?: string;
}

export class RateLimitService {
	/**
	 * Verificar si una solicitud excede el límite de velocidad
	 * @param ip Dirección IP del cliente
	 * @param identifier Identificador opcional (email, nombre de usuario) para limitación por usuario
	 * @param config Configuración del límite de velocidad
	 * @returns Objeto con bandera permitida y cantidad de intentos
	 */
	static check(ip: string, identifier: string | null, config: RateLimitConfig) {
		const result = {
			allowed: true,
			attempts: 0,
			retryAfter: 0
		};

		// Verificar límite basado en IP
		const ipKey = `ratelimit:ip:${ip}`;
		const ipAttempts = cache.get<number>(ipKey) ?? 0;

		if (ipAttempts >= config.maxAttempts) {
			result.allowed = false;
			result.attempts = ipAttempts;
			result.retryAfter = config.windowMs;
			return result;
		}

		// Verificar límite basado en identificador si se proporciona (más estricto)
		if (identifier) {
			const idKey = `ratelimit:${config.keyPrefix || 'auth'}:${identifier}`;
			const idAttempts = cache.get<number>(idKey) ?? 0;

			if (idAttempts >= config.maxAttempts) {
				result.allowed = false;
				result.attempts = idAttempts;
				result.retryAfter = config.windowMs;
				return result;
			}
		}

		return result;
	}

	/**
	 * Registrar un intento
	 * @param ip Dirección IP del cliente
	 * @param identifier Identificador opcional para limitación por usuario
	 * @param config Configuración del límite de velocidad
	 */
	static record(ip: string, identifier: string | null, config: RateLimitConfig) {
		// Registrar intento por IP
		const ipKey = `ratelimit:ip:${ip}`;
		const ipAttempts = (cache.get<number>(ipKey) ?? 0) + 1;
		cache.set(ipKey, ipAttempts, config.windowMs);

		// Registrar intento por identificador si se proporciona
		if (identifier) {
			const idKey = `ratelimit:${config.keyPrefix || 'auth'}:${identifier}`;
			const idAttempts = (cache.get<number>(idKey) ?? 0) + 1;
			cache.set(idKey, idAttempts, config.windowMs);
		}
	}

	/**
	 * Reiniciar límite de velocidad para un identificador (llamar después de autenticación exitosa)
	 */
	static reset(ip: string, identifier: string | null, config: RateLimitConfig) {
		cache.invalidate(`ratelimit:ip:${ip}`);
		if (identifier) {
			cache.invalidate(`ratelimit:${config.keyPrefix || 'auth'}:${identifier}`);
		}
	}
}

// Preset configurations
export const AUTH_RATE_LIMITS = {
	LOGIN: {
		maxAttempts: 5,
		windowMs: 15 * 60 * 1000, // 15 minutes
		keyPrefix: 'login'
	} as RateLimitConfig,

	REGISTER: {
		maxAttempts: 3,
		windowMs: 60 * 60 * 1000, // 1 hour
		keyPrefix: 'register'
	} as RateLimitConfig
};
