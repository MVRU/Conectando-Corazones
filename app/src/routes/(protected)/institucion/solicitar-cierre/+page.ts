import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, depends }) => {
	// Depend on the proyecto parameter so data is revalidated when it changes
	depends('solicitar-cierre:proyecto');

	const proyectoId = url.searchParams.get('proyecto');

	// Invalidate cache when proyecto param changes
	return {
		proyectoId
	};
};
