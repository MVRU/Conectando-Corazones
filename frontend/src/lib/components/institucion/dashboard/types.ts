// -*- DECISIÓN DE DISEÑO: Definimos tipados compartidos para reforzar el contrato entre vistas y datos.

import type { ComponentType } from 'svelte';

export type ViewMode =
	| 'dashboard'
	| 'projects'
	| 'chat'
	| 'profile'
	| 'settings'
	| 'collaborations';

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
	
	insight: string;
}

export interface AidDonutSegment extends AidType {
	startPercent: number;
	endPercent: number;
	dashArray: string;
	dashOffset: number;
}

export interface QuickAction {
	label: string;
	icon: IconComponent;
	badge: string | null;
	statusColor?: string;
	view?: ViewMode;
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
        organization?: string;
        role: 'Colaborador' | 'Institución';
        content: string;
        sentAt: string;
        direction: MessageDirection;
        avatar?: string | null;
}

export interface ChatThread {
	chatId: number;
	subject: string;
	messages: ChatMessage[];
}

export type ParticipantKind = 'institucion' | 'empresa' | 'ong' | 'voluntario';

export interface ChatParticipant {
        id: string;
        name: string;
        role: 'Institución' | 'Colaborador';
        kind: ParticipantKind;
        description: string;
        contact: string;
        avatar?: string | null;
}	

export type AttachmentCategory = 'galeria' | 'evidencia';

export type AttachmentFileType = 'image' | 'pdf';

export type AttachmentFormat = 'pdf' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'docx' | 'xlsx';

export type EvidenceFlow = 'entrada' | 'salida';

export interface ChatAttachment {
        id: string;
        name: string;
        category: AttachmentCategory;
        fileType: AttachmentFileType;
        fileExtension: AttachmentFormat;
        description: string;
        uploadedAt: string;
        previewImage?: string | null;
        evidenceFlow?: EvidenceFlow;
        downloadUrl?: string | null;
}

export interface ChatObjective {
        id: string;
        progressLabel: string;
        resourceType: string;
        sponsor: string;
}

export interface ChatProjectInfo {
        name: string;
        location: string;
        tentativeClosure: string;
        remainingDays: number;
        objectives: ChatObjective[];
}
export interface ChatMetadata {
        chatId: number;
        institution: ChatParticipant;
        collaborators: ChatParticipant[];
        attachments: ChatAttachment[];
        project: ChatProjectInfo;
}


export type ChatMetadataMap = Record<number, ChatMetadata>;


export interface ProjectItem {
	id: number;
	name: string;
	status: string;
	date: string;
	statusColor: string;
}

export type CollaborationKind = 'empresa' | 'ong' | 'voluntariado';

export interface CollaborationRequest {
	id: string;
	collaboratorName: string;
	organizationName: string;
	kind: CollaborationKind;
	email: string;
	submittedAt: string;
	message: string;
	experienceSummary: string;
}

export interface ActiveCollaborator {
	id: string;
	name: string;
	role: string;
	email: string;
	joinedAt: string;
	contribution: string;
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