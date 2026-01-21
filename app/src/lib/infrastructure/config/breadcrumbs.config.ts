/**
 * * DECISIÓN DE DISEÑO
 *    -*- Configuración centralizada de las rutas con Breadcrumbs.
 *    -*- Permite habilitarlas sin alterar la lógica del store.
 */

export const ENABLED_BREADCRUMB_PATHS = ['/projects/:id'];

/**
 * -!- Verifica si la ruta actual está habilitada para mostrar Breadcrumbs.
 */
export function shouldShowBreadcrumbs(pathname: string): boolean {
	const normalized = pathname.replace(/\/+$/, '') || '/';
	return ENABLED_BREADCRUMB_PATHS.some((pattern) => matchRoute(normalized, pattern));
}

// * Utilidad interna para comparar rutas con segmentos dinámicos
function matchRoute(path: string, pattern: string): boolean {
	const pathSegments = path.split('/').filter(Boolean);
	const patternSegments = pattern.split('/').filter(Boolean);
	if (pathSegments.length !== patternSegments.length) return false;
	return patternSegments.every((seg, i) => seg.startsWith(':') || seg === pathSegments[i]);
}
