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

export function resolveRelatedEvidenceNames(
        attachment: ChatAttachment,
        evidenceCollection: ChatAttachment[]
): string[] {
        const identifiers = attachment.relatedEvidenceId?.filter(Boolean) ?? [];
        if (identifiers.length === 0) return [];

        const names = identifiers
                .map((identifier) => evidenceCollection.find((item) => item.id === identifier)?.name ?? identifier)
                .filter((value): value is string => Boolean(value));

        return Array.from(new Set(names));
}

export function isAiGeneratedEvidence(attachment: ChatAttachment): boolean {
	return Boolean(attachment.isAiGenerated);
}

export function buildRelationTooltip(
        attachment: ChatAttachment,
        evidenceCollection: ChatAttachment[]
): string | null {
        const relatedNames = resolveRelatedEvidenceNames(attachment, evidenceCollection);
        if (relatedNames.length === 0) return null;
        if (relatedNames.length === 1) {
                return `Relacionada con ${relatedNames[0]}`;
        }
        return `Relacionada con: ${relatedNames.join(', ')}`;
}