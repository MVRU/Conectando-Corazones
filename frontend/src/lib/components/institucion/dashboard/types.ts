// -*- DECISIÓN DE DISEÑO: Definimos tipados compartidos para reforzar el contrato entre vistas y datos.
import type { ComponentType } from 'svelte';

export type ViewMode = 'dashboard' | 'projects' | 'chat' | 'profile' | 'settings';

export type IconComponent = ComponentType;

export interface NavItem {
	label: string;
	icon: IconComponent;
	view: ViewMode;
}

export interface Metric {
	label: string;
	value: string;
	icon: IconComponent;
	color: string;
}

export type GradKey = 'green' | 'blue' | 'purple';

export interface ProgressSegment {
	label: string;
	percent: number;
	grad: GradKey;
}

export interface AidType {
	label: string;
	percent: number;
	grad: GradKey;
}

export interface QuickAction {
	label: string;
	icon: IconComponent;
	badge: string | null;
	statusColor?: string;
}

export interface ChatItem {
	name: string;
	lastMessage: string;
	time: string;
	statusColor: string;
	isUnread: boolean;
}

export interface ProjectItem {
	id: number;
	name: string;
	status: string;
	date: string;
	statusColor: string;
}

export interface BannerMessage {
	title: string;
	highlight: string;
	description: string;
	cta: string;
}