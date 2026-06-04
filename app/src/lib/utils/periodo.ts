export type PeriodoSlug = 'todo' | '30d' | '90d' | '1a';

export interface PeriodoOpcion {
	slug: PeriodoSlug;
	label: string;
	tituloPDF: string | null;
}

export const PERIODO_OPCIONES: readonly PeriodoOpcion[] = [
	{ slug: 'todo', label: 'Todo el tiempo', tituloPDF: null },
	{ slug: '30d', label: 'Últimos 30 días', tituloPDF: 'Últimos 30 días' },
	{ slug: '90d', label: 'Últimos 90 días', tituloPDF: 'Últimos 90 días' },
	{ slug: '1a', label: 'Último año', tituloPDF: 'Último año' }
] as const;

export function normalizarPeriodo(input: string | null | undefined): PeriodoSlug {
	if (input === '30d' || input === '90d' || input === '1a') return input;
	return 'todo';
}

export function obtenerDesdePeriodo(slug: PeriodoSlug): Date | null {
	if (slug === 'todo') return null;
	const desde = new Date();
	if (slug === '30d') {
		desde.setDate(desde.getDate() - 30);
		return desde;
	}
	if (slug === '90d') {
		desde.setDate(desde.getDate() - 90);
		return desde;
	}
	if (slug === '1a') {
		desde.setFullYear(desde.getFullYear() - 1);
		return desde;
	}
	return null;
}

export function obtenerTituloPeriodo(slug: PeriodoSlug): string | null {
	return PERIODO_OPCIONES.find((o) => o.slug === slug)?.tituloPDF ?? null;
}
