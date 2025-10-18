// -*- DECISIÓN DE DISEÑO: Reunimos funciones puras reutilizables para mantener el componente principal enfocado en la vista.
import { Briefcase, LayoutGrid, MessageSquare } from 'lucide-svelte';

import type { AidType, GradKey, QuickAction, ViewMode } from './types';
import { quickActionLabels } from './data';
import { ERROR_COLOR, PRIMARY_500 } from './tokens';

export const gradientClasses: Record<GradKey, string> = {
	green: 'from-emerald-300 via-emerald-400 to-emerald-500',
	blue: 'from-sky-300 via-sky-400 to-sky-500',
	purple: 'from-violet-300 via-violet-400 to-violet-500'
};

export function getGradientClass(color: GradKey): string {
	return gradientClasses[color] ?? 'from-slate-300 via-slate-400 to-slate-500';
}

export function getGradientCSS(color: GradKey): string {
	switch (color) {
		case 'green':
			return 'linear-gradient(90deg, #6ee7b7, #34d399, #10b981)';
		case 'blue':
			return 'linear-gradient(90deg, #7dd3fc, #38bdf8, #0ea5e9)';
		case 'purple':
			return 'linear-gradient(90deg, #c4b5fd, #a78bfa, #8b5cf6)';
		default:
			return 'linear-gradient(90deg, #cbd5e1, #94a3b8, #64748b)';
	}
}

export function midHex(color: GradKey): string {
	return (
		{
			green: '#34d399',
			blue: '#38bdf8',
			purple: '#a78bfa'
		}[color] ?? '#94a3b8'
	);
}

export function getDonutGradient(segments: AidType[]): string {
	let gradientString = 'conic-gradient(';
	let currentPercent = 0;

	segments.forEach((item, index) => {
		const start = currentPercent;
		currentPercent += item.percent;
		const end = currentPercent;
		const color = midHex(item.grad);
		gradientString +=
			index < segments.length - 1 ? `${color} ${start}% ${end}%, ` : `${color} ${start}% 100%`;
	});

	return `${gradientString})`;
}

export function computeQuickActions(
	viewMode: ViewMode,
	projectCount: number,
	unreadChats: number
): QuickAction[] {
	switch (viewMode) {
		case 'projects':
			return [
				{
					label: `${projectCount} proyectos registrados`,
					icon: Briefcase,
					badge: projectCount.toString(),
					statusColor: PRIMARY_500
				}
			];
		case 'chat':
			return [
				{
					label: 'Conversaciones pendientes',
					icon: MessageSquare,
					badge: unreadChats ? unreadChats.toString() : null,
					statusColor: unreadChats ? ERROR_COLOR : PRIMARY_500
				}
			];
		default:
			return quickActionLabels.map((label) => ({
				label,
				icon: LayoutGrid,
				badge: label === 'Ver solicitudes' ? '3' : null,
				statusColor: label === 'Ver solicitudes' ? ERROR_COLOR : PRIMARY_500
			}));
	}
}