import { writable, derived } from 'svelte/store';
import { page } from '$app/stores';

// * DECISIÓN DE DISEÑO
// -*- Este store genera las migas de pan automáticamente a partir de la ruta
// -*- actual y permite sobreescribirlas con valores manuales. Se ocultan cuando
// -*- el total no supera dos elementos para evitar ruido visual.

export interface BreadcrumbItem {
        label: string;
        href?: string; // Si no tiene href, es el item actual (no clickeable)
}

// * Migas definidas manualmente
const custom = writable<BreadcrumbItem[] | null>(null);

// * Migas automáticas derivadas de la ruta
const auto = derived(page, ($page) => {
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

// * Migas en uso (manuales o automáticas)
export const breadcrumbs = derived([auto, custom], ([$auto, $custom]) => {
        if ($custom && $custom.length > 2) return $custom;
        return $auto;
});

// Función para establecer breadcrumbs manuales
export function setBreadcrumbs(items: BreadcrumbItem[]) {
        custom.set(items.length > 2 ? items : []);
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
