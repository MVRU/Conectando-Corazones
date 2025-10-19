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
	id: number;
	name: string;
	lastMessage: string;
	time: string;
	statusColor: string;
	isUnread: boolean;
}

export type MessageDirection = 'incoming' | 'outgoing';

export interface ChatMessage {
	id: number;
	author: string;
	content: string;
	sentAt: string;
	direction: MessageDirection;
}

export interface ChatThread {
	chatId: number;
	subject: string;
	messages: ChatMessage[];
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

export type DocumentStatus = 'Aprobado' | 'Pendiente' | 'Rechazado';

export interface VerificationDocument {
        label: string;
        status: DocumentStatus;
        detail: string;
}

export type ObservationType = 'info' | 'alert' | 'action';

export interface ObservationItem {
        message: string;
        recordedAt: string;
        type: ObservationType;
}

export type RiskLevel = 'none' | 'low' | 'medium' | 'high';

export interface ReportingStatus {
        hasReports: boolean;
        message: string;
        lastUpdate: string;
        riskLevel: RiskLevel;
}

export interface VerificationSummary {
        status: string;
        description: string;
        method: string;
        lastReview: string;
        nextReview: string;
        reviewer: string;
        reliabilityLevel: string;
        documentsReviewed: number;
}

export interface LegalRepresentative {
        name: string;
        idType: string;
        idNumber: string;
        email: string;
}

export interface InstitutionIdentity {
        name: string;
        registrationId: string;
        sector: string;
        location: string;
        legalRepresentative: LegalRepresentative;
        contactPhone: string;
        website?: string;
}