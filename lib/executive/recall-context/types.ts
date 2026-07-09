import type {
  ExecutiveConcernImportance,
  ExecutiveConcernStatus,
} from "../concern";

export type ExecutiveRecallContextEvidence = {
  id: string;
  summary: string;
  sourceId?: string;
};

export type ExecutiveRecallContextRecommendation = {
  summary: string;
  suggestedNextStep: string;
  evidenceIds: string[];
};

export type ExecutiveRecallContextClarification = {
  question: string;
  reason: string;
  evidenceIds: string[];
};

export type ExecutiveRecallContextConcern = {
  id: string;
  title: string;
  status: ExecutiveConcernStatus;
  importance: ExecutiveConcernImportance;
  confidence: number;
  reason: string;
  firstObserved: Date;
  lastObserved: Date;
  evidence: ExecutiveRecallContextEvidence[];
  latestRecommendation?: ExecutiveRecallContextRecommendation;
  clarificationNeeded?: ExecutiveRecallContextClarification;
};

export type ExecutiveRecallContext = {
  generatedAt: Date;
  recalledConcernCount: number;
  totalConcernCount: number;
  excludedConcernCount: number;
  concerns: ExecutiveRecallContextConcern[];
};
