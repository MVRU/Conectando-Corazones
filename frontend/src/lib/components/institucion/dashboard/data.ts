// -*- DECISIÓN DE DISEÑO: Centralizamos el mock de datos para facilitar reemplazos por peticiones reales.
import {
	Bell,
	Briefcase,
	Gauge,
	LayoutGrid,
	Lightbulb,
	LogOut,
	MessageSquare,
	Plus,
	Settings,
	ShieldCheck,
	TrendingUp,
	User,
	Users
} from 'lucide-svelte';

import type {
	AidType,
	ChatItem,
	Metric,
	NavItem,
	ProgressSegment,
	ProjectItem,
	ViewMode
} from './types';
import { ERROR_COLOR, GREEN, PRIMARY_500, WARNING_COLOR } from './tokens';

export const metrics: Metric[] = [
	{ label: 'Proyectos totales', value: '1', icon: Briefcase, color: PRIMARY_500 },
	{ label: 'Colaboradores totales', value: '0', icon: Users, color: WARNING_COLOR },
	{ label: 'Próx. Finalización', value: '20 días', icon: Gauge, color: ERROR_COLOR }
];

export const navItems: NavItem[] = [
	{ label: 'Mi panel', icon: LayoutGrid, view: 'dashboard' },
	{ label: 'Proyectos', icon: Briefcase, view: 'projects' },
	{ label: 'Mensajes', icon: MessageSquare, view: 'chat' },
	{ label: 'Perfil', icon: User, view: 'profile' },
	{ label: 'Configuración', icon: Settings, view: 'settings' }
];

export const quickActionLabels: string[] = [
	'Ver solicitudes',
	'Cargar evidencia',
	'Mis proyectos',
	'Mis chats',
	'Ver progresos',
	'Solicitar cierre'
];

export const chatItems: ChatItem[] = [
	{
		name: 'Luz para Aprender',
		lastMessage: 'Pendiente de aprobación.',
		time: 'Hace 5m',
		statusColor: ERROR_COLOR,
		isUnread: true
	}
];

export const projectItems: ProjectItem[] = [
	{
		id: 1,
		name: 'Luz para Aprender',
		status: 'En Curso',
		date: '30/10/2025',
		statusColor: GREEN
	},
	{
		id: 2,
		name: 'Patio de colores',
		status: 'Borrador',
		date: '25/11/2025',
		statusColor: PRIMARY_500
	}
];

export const luzParaAprenderProgress: ProgressSegment[] = [
	{ label: 'Donación monetaria', percent: 15, grad: 'green' },
	{ label: 'Lámparas LED', percent: 40, grad: 'blue' },
	{ label: 'Electricistas', percent: 80, grad: 'purple' }
];

export const ayudaTypes: AidType[] = [
	{ label: 'Voluntariado', percent: 32, grad: 'purple' },
	{ label: 'Monetaria', percent: 33, grad: 'green' },
	{ label: 'En especie', percent: 35, grad: 'blue' }
];

export const filterLabels = ['Período', 'Categoría', 'Estado', 'Tipo de ayuda', 'Ubicación'];

export const profileHighlights = {
	verification: {
		icon: ShieldCheck,
		title: 'Verificación Exitosa'
	},
	pendingReview: {
		icon: Lightbulb,
		title: 'Aspectos a mejorar'
	},
	logout: LogOut
};

export const callToActionIcon = Plus;
export const notificationIcon = Bell;
export const trendingIcon = TrendingUp;

export const quickActionIcon = LayoutGrid;

export const viewModeLabels: Record<ViewMode, string> = {
	dashboard: 'Mi panel',
	projects: 'Proyectos',
	chat: 'Mensajes',
	profile: 'Perfil',
	settings: 'Configuración'
};

export const filtersResetLabel = 'Limpiar';