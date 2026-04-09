import { writable, derived, get } from 'svelte/store';
import { page } from '$app/stores';
import { shouldShowBreadcrumbs } from '$lib/infrastructure/config/breadcrumbs.config';

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

const custom = writable<BreadcrumbItem[] | null>(null);

const auto = derived(page, ($page) => {
	if (!shouldShowBreadcrumbs($page.url)) return [];

	const segments = $page.url.pathname.split('/').filter(Boolean);
	let path = '';
	const items: BreadcrumbItem[] = [
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

	return items.length >= 2 ? items : [];
});

export const breadcrumbs = derived([page, auto, custom], ([$page, $auto, $custom]) => {
	if (!shouldShowBreadcrumbs($page.url)) return [];
	if ($custom && $custom.length) return $custom;
	return $auto;
});

export function setBreadcrumbs(items: BreadcrumbItem[]) {
	const currentUrl = get(page).url;
	if (shouldShowBreadcrumbs(currentUrl)) {
		custom.set(items);
	} else {
		custom.set(null);
	}
}

export function clearBreadcrumbs() {
	custom.set(null);
}

export const BREADCRUMB_ROUTES = {
	proyectos: { label: 'Proyectos', href: '/proyectos' },
	personas: { label: 'Personas', href: '/perfil' }
};
