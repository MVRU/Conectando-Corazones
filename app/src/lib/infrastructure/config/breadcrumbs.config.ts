/**
 * * DECISIÓN DE DISEÑO
 *    -*- Configuración centralizada de las rutas con Breadcrumbs.
 *    -*- Permite habilitarlas sin alterar la lógica del store.
 */

export const ENABLED_BREADCRUMB_PATHS = [
	// Público
	'/proyectos/:id',
	'/perfil/:username',

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
