// -*- DECISIÓN DE DISEÑO: se centraliza la lógica de metadatos de evidencias para mantener consistencia visual y semántica

import type { ChatAttachment, EvidenceFlow } from '../types';

const FLOW_LABEL: Record<EvidenceFlow, string> = {
	entrada: 'Entrada',
	salida: 'Salida'
};

const FLOW_VARIANT: Record<EvidenceFlow, 'entrada' | 'salida'> = {
	entrada: 'entrada',
	salida: 'salida'
};

export function resolveEvidenceFlowLabel(flow?: EvidenceFlow): string | null {
	if (!flow) return null;
	return FLOW_LABEL[flow];
}

export function resolveEvidenceFlowVariant(flow?: EvidenceFlow): 'entrada' | 'salida' | null {
	if (!flow) return null;
	return FLOW_VARIANT[flow];
}

export function resolveRelatedEvidenceName(
	attachment: ChatAttachment,
	evidenceCollection: ChatAttachment[]
): string | null {
	if (!attachment.relatedEvidenceId) return null;
	const related = evidenceCollection.find((item) => item.id && item.id === attachment.relatedEvidenceId
);
	return related?.name ?? null;
}

export function isAiGeneratedEvidence(attachment: ChatAttachment): boolean {
	return Boolean(attachment.isAiGenerated);
}

export function buildRelationTooltip(
	attachment: ChatAttachment,
	evidenceCollection: ChatAttachment[]
): string | null {
	const relatedName = resolveRelatedEvidenceName(attachment, evidenceCollection);
	if (!relatedName) return null;
	return `Relacionada con ${relatedName}`;
}