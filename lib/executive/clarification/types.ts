import type { ExecutiveReasoningEvidence } from "@/lib/executive/reasoning";
import type { ExecutiveSituationCandidate } from "@/lib/executive/situation";

export type ClarificationRequestStatus =
  | "pending"
  | "answered"
  | "dismissed";

export type ClarificationAnswerChoice = {
  id: string;
  label: string;
  value: string;
};

export type ClarificationRequestCandidate = {
  question: string;
  whyForgeIsAsking: string;
  uncertainty: string;
  evidenceIds: string[];
  situationIds: string[];
  answerChoices?: ClarificationAnswerChoice[];
  allowsFreeFormAnswer: boolean;
  confidence: number;
};

export type ClarificationEvidence = ExecutiveReasoningEvidence;

export type ClarificationSituation = ExecutiveSituationCandidate;

export type ClarificationRequest = {
  id: string;
  question: string;
  whyForgeIsAsking: string;
  uncertainty: string;
  evidence: ClarificationEvidence[];
  situations: ClarificationSituation[];
  answerChoices: ClarificationAnswerChoice[];
  allowsFreeFormAnswer: boolean;
  confidence: number;
  status: ClarificationRequestStatus;
  createdAt: Date;
  answeredAt?: Date;
};
