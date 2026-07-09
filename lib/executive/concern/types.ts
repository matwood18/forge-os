export type ExecutiveConcernStatus =
  | "open"
  | "watching"
  | "blocked"
  | "resolved"
  | "dismissed";

export type ExecutiveConcernImportance = "low" | "medium" | "high" | "critical";

export type ExecutiveConcernEvidenceKind =
  | "sourceDocument"
  | "semanticClaim"
  | "executivePriority"
  | "executiveAttention"
  | "suggestion"
  | "clarification"
  | "operatorUpdate"
  | "resolution";

export type ExecutiveConcernEvidence = {
  id: string;
  kind: ExecutiveConcernEvidenceKind;
  summary: string;
  observedAt: Date;
  sourceId?: string;
};

export type ExecutiveConcernRecommendation = {
  id: string;
  summary: string;
  suggestedNextStep: string;
  createdAt: Date;
  evidenceIds: string[];
};

export type ExecutiveConcernClarification = {
  id: string;
  question: string;
  reason: string;
  createdAt: Date;
  evidenceIds: string[];
};

export type ExecutiveConcernResolution = {
  resolvedAt: Date;
  summary: string;
  evidenceIds: string[];
};

export type ExecutiveConcern = {
  id: string;
  title: string;
  status: ExecutiveConcernStatus;
  importance: ExecutiveConcernImportance;
  confidence: number;
  firstObserved: Date;
  lastObserved: Date;
  supportingEvidence: ExecutiveConcernEvidence[];
  latestRecommendation?: ExecutiveConcernRecommendation;
  clarificationNeeded?: ExecutiveConcernClarification;
  resolution?: ExecutiveConcernResolution;
};

export type ExecutiveConcernCreateInput = {
  id: string;
  title: string;
  status?: ExecutiveConcernStatus;
  importance: ExecutiveConcernImportance;
  confidence: number;
  observedAt: Date;
  evidence: ExecutiveConcernEvidence[];
  latestRecommendation?: ExecutiveConcernRecommendation;
  clarificationNeeded?: ExecutiveConcernClarification;
};

export type ExecutiveConcernUpdateInput = {
  id: string;
  status?: ExecutiveConcernStatus;
  importance?: ExecutiveConcernImportance;
  confidence?: number;
  observedAt?: Date;
  evidence?: ExecutiveConcernEvidence[];
  latestRecommendation?: ExecutiveConcernRecommendation;
  clarificationNeeded?: ExecutiveConcernClarification;
  resolution?: ExecutiveConcernResolution;
};

