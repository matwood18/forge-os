import type { ExecutiveSituationEvidence } from "@/lib/executive/situation";

export type ExecutiveConcernIdentityEvidenceKind =
  | "semantic_obligation";

export type ExecutiveConcernIdentityEvidence = {
  id: string;
  kind: ExecutiveConcernIdentityEvidenceKind;
  label: string;
  summary: string;
  sourceEvidenceIds: string[];
  confidence: number;
};

export type ExecutiveConcernIdentityEvidenceProjectionInput = {
  evidence: ExecutiveSituationEvidence[];
};

export type ExecutiveConcernIdentityEvidenceProjectionResult = {
  identityEvidence: ExecutiveConcernIdentityEvidence[];
  generatedAt: Date;
};
