import { browser } from '$app/environment';

const KEY = 'chat:lastVisit';

export function obtenerUltimaVisitaChat(): string | null {
	if (!browser) return null;
	return localStorage.getItem(KEY);
}

export function marcarVisitaChat(): void {
	if (!browser) return;
	localStorage.setItem(KEY, new Date().toISOString());
}

export function tieneNuevosMensajes(ultimoMensajeAjenoAt: string | null): boolean {
	if (!browser) return false;
	if (!ultimoMensajeAjenoAt) return false;
	const visto = obtenerUltimaVisitaChat();
	if (!visto) return true;
	return new Date(ultimoMensajeAjenoAt) > new Date(visto);
}
