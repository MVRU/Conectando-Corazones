import { writable } from 'svelte/store';

export interface BreadcrumbItem {
	label: string;
	href?: string; // Si no tiene href, es el item actual (no clickeable)
}

// Store para manejar los breadcrumbs globalmente
export const breadcrumbs = writable<BreadcrumbItem[]>([]);

// Función helper para establecer breadcrumbs fácilmente
export function setBreadcrumbs(items: BreadcrumbItem[]) {
	breadcrumbs.set(items);
}

// Función helper para limpiar breadcrumbs
export function clearBreadcrumbs() {
	breadcrumbs.set([]);
}

// Breadcrumbs predefinidos para rutas comunes
export const BREADCRUMB_ROUTES = {
	home: { label: 'Inicio', href: '/' },
	projects: { label: 'Proyectos', href: '/projects' },
	about: { label: 'Nosotros', href: '/about' },
	contact: { label: 'Contacto', href: '/contact' }
}; 