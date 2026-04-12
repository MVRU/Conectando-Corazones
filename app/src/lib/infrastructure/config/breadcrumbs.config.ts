export const ENABLED_BREADCRUMB_PATHS = [
	// Público
	'/proyectos/:id',

	// Proyectos
	'/proyectos/:id/editar',
	'/proyectos/crear',

	// Institución
	'/institucion/solicitudes-colaboracion',
	'/institucion/proyectos/:id/aportes',
	'/institucion/proyectos/:id/aportes/colaborador/:colaboradorId',
	'/institucion/proyectos/:id/aportes/evidencias/nueva',

	// Colaborador
	'/colaborador/proyectos/:id/mis-aportes',
	'/colaborador/proyectos/:id/mis-aportes/nuevo',
	'/colaborador/proyectos/:id/evaluar-cierre',

	// Mensajes
	'/mensajes/:proyecto_id'
];

/**
 * -!- Verifica si la ruta actual está habilitada para mostrar Breadcrumbs.
 */
export function shouldShowBreadcrumbs(input: string | URL): boolean {
	const url = typeof input === 'string' ? new URL(input, 'http://breadcrumbs.local') : input;
	const normalized = url.pathname.replace(/\/+$/, '') || '/';

	if (matchRoute(normalized, '/perfil/:username')) {
		return hasProfileBreadcrumbContext(url);
	}

	return ENABLED_BREADCRUMB_PATHS.some((pattern) => matchRoute(normalized, pattern));
}

export function hasProfileBreadcrumbContext(url: URL): boolean {
	const from = url.searchParams.get('from');
	const proyectoId = url.searchParams.get('proyecto');

	if (from === 'proyecto') {
		return Boolean(proyectoId);
	}

	if (from === 'solicitudes') {
		return true;
	}

	return false;
}

// * Utilidad interna para comparar rutas con segmentos dinámicos
function matchRoute(path: string, pattern: string): boolean {
	const pathSegments = path.split('/').filter(Boolean);
	const patternSegments = pattern.split('/').filter(Boolean);
	if (pathSegments.length !== patternSegments.length) return false;
	return patternSegments.every((seg, i) => seg.startsWith(':') || seg === pathSegments[i]);
}
