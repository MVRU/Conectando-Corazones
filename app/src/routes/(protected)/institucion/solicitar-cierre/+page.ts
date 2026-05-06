import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, depends, data }) => {
	// Depend on the proyecto parameter so data is revalidated when it changes
	depends('solicitar-cierre:proyecto');

	const proyectoId = url.searchParams.get('proyecto');

	// Keep server data and add the current query param for local UI sync.
	return {
		proyectoId,
		...data
	};
};
