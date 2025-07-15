import { writable, derived, get } from 'svelte/store';
import { page } from '$app/stores';
import { shouldShowBreadcrumbs } from '$lib/config/breadcrumbs';

// * DECISIÓN DE DISEÑO
// -*- Fuente única de verdad para las migas de pan.
// -*- Genera las rutas sólo en páginas habilitadas y permite reemplazarlas manualmente.
// -*- Ignora los intentos de establecer migas si la ruta no está habilitada.

export interface BreadcrumbItem {
        label: string;
        href?: string; // Si no tiene href, es el item actual (no clickeable)
}

// * Migas definidas manualmente
const custom = writable<BreadcrumbItem[] | null>(null);

// * Migas automáticas derivadas de la ruta
const auto = derived(page, ($page) => {
        if (!shouldShowBreadcrumbs($page.url.pathname)) return [];

        const segments = $page.url.pathname.split('/').filter(Boolean);
        let path = '';
        const items: BreadcrumbItem[] = [
                { label: 'Inicio', href: '/' },
                ...segments.map((segment, idx) => {
                        path += '/' + segment;
                        return {
                                label: decodeURIComponent(
                                        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
                                ),
                                href: idx < segments.length - 1 ? path : undefined
                        };
                })
        ];

        return items.length > 2 ? items : [];
});

// * Migas en uso (manuales o automáticas) según la ruta actual
export const breadcrumbs = derived([page, auto, custom], ([$page, $auto, $custom]) => {
        if (!shouldShowBreadcrumbs($page.url.pathname)) return [];
        if ($custom && $custom.length) return $custom;
        return $auto;
});

// Función para establecer breadcrumbs manuales
export function setBreadcrumbs(items: BreadcrumbItem[]) {
        const currentPath = get(page).url.pathname;
        if (shouldShowBreadcrumbs(currentPath)) {
                custom.set(items);
        } else {
                custom.set(null);
        }
}

// Limpia las migas personalizadas
export function clearBreadcrumbs() {
        custom.set(null);
}

export const BREADCRUMB_ROUTES = {
        home: { label: 'Inicio', href: '/' },
        projects: { label: 'Proyectos', href: '/projects' },
        about: { label: 'Nosotros', href: '/about' },
        contact: { label: 'Contacto', href: '/contact' },
        faq: { label: 'Preguntas frecuentes', href: '/faq' },
        login: { label: 'Iniciar sesión', href: '/login' },
        signin: { label: 'Registrarse', href: '/signin' }
};
