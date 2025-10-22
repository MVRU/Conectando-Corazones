// -*- DECISIÓN DE DISEÑO: definimos tipos compartidos para mantener consistencia en los prompts y habilitar validación estática estricta

export interface Review {
  readonly source: string;
  readonly role: string;
  readonly score: number;
  readonly comment: string;
  readonly createdAt: string;
}

export interface ProjectObjective {
  readonly id: string;
  readonly description: string;
  readonly unit: string;
  readonly target: number;
  readonly achieved: number;
  readonly evidenceSummary?: string;
}

export interface CollaboratorSummary {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly joinedAt: string;
  readonly contribution: string;
  readonly contactEmail?: string;
}

export interface TimelineEvent {
  readonly label: string;
  readonly date: string;
  readonly notes?: string;
}

export interface CommunicationHighlight {
  readonly author: string;
  readonly organization: string;
  readonly sentAt: string;
  readonly summary: string;
}

export interface ProjectReportContext {
  readonly project: {
    readonly id: string;
    readonly legacyNumericId: number;
    readonly title: string;
    readonly tagline: string;
    readonly description: string;
    readonly categories: readonly string[];
    readonly beneficiaries: {
      readonly direct: number;
      readonly summary: string;
    };
    readonly location: string;
    readonly institution: {
      readonly name: string;
      readonly sector: string;
      readonly representative: string;
      readonly contactEmail: string;
      readonly contactPhone: string;
    };
    readonly timeline: readonly TimelineEvent[];
  };
  readonly closure: {
    readonly readinessLabel: string;
    readonly progressPercent: number;
    readonly objectives: readonly ProjectObjective[];
  };
  readonly collaborators: readonly CollaboratorSummary[];
  readonly communications: readonly CommunicationHighlight[];
  readonly participationSummary: {
    readonly volunteers: number;
    readonly inKindContributions: number;
    readonly monetaryContributionsARS: number;
  };
  readonly fundingBreakdown: readonly {
    readonly label: string;
    readonly percent: number;
    readonly insight: string;
  }[];
  readonly reviews: {
    readonly averageScore: number;
    readonly details: readonly Review[];
  };
  readonly metrics: readonly {
    readonly label: string;
    readonly value: string;
  }[];
  readonly pendingRequests: readonly string[];
  readonly aiNotice: string;
}