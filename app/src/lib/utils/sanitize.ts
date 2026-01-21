/**
 * * DECISIÓN DE DISEÑO
 *     -*- Utilidades centralizadas para sanitizar entradas y evitar XSS.
 *     -*- Facilita el reuso y mantiene el código más seguro.
 */

export function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function escapeHtml(text: string): string {
	return text.replace(/[&<>"']/g, (ch) => {
		const map: Record<string, string> = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;'
		};
		return map[ch] ?? ch;
	});
}

/**
 * -!- Verifica que una URL sea segura para navegación.
 * ? Acepta rutas internas o enlaces http(s); bloquea esquemas peligrosos.
 */
export function isSafeHref(url: string): boolean {
	// * Rechaza protocolos como `javascript:` al exigir rutas o http(s)
	return /^(?:\/(?!\/)|https?:\/\/)/i.test(url);
}

/**
 * -!- Resalta ocurrencias de `query` en `text` de forma segura.
 */
export function highlightSearch(text: string, query: string): string {
	const clean = query.trim();
	const safeText = escapeHtml(text);
	if (!clean) return safeText;
	const safeQuery = escapeHtml(clean);
	const regex = new RegExp(`(${escapeRegExp(safeQuery)})`, 'gi');
	return safeText.replace(regex, '<mark class="bg-blue-200 px-1 rounded">$1</mark>');
}
