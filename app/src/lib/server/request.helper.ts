import type { RequestEvent } from '@sveltejs/kit';

/**
 * Extraer IP del cliente de la solicitud
 * Maneja proxies, balanceadores de carga y conexiones directas
 */
export function getClientIp(event: RequestEvent): string {
	// Verificar encabezado X-Forwarded-For (proxy/balanceador de carga)
	const forwarded = event.request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}

	// Verificar CF-Connecting-IP (Cloudflare)
	const cfConnectingIp = event.request.headers.get('cf-connecting-ip');
	if (cfConnectingIp) {
		return cfConnectingIp;
	}

	// Verificar X-Real-IP (Nginx)
	const realIp = event.request.headers.get('x-real-ip');
	if (realIp) {
		return realIp;
	}

	// Fallback a dirección de origen
	const origin = event.getClientAddress?.();
	return origin || '0.0.0.0';
}
