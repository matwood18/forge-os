export type ExecutiveSituationIdentityMetadata =
  | {
      kind: "semantic_claim";
      subject: string;
      predicate: string;
      object: string;
    };

export type ExecutiveSituationEvidence = {
  id: string;
  label: string;
  summary: string;
  confidence?: number;
  source?: string;
  identityMetadata?: ExecutiveSituationIdentityMetadata;
  identityEvidenceIds?: string[];
};

export type ExecutiveSituationInput = {
  sourceText: string;
  evidence: ExecutiveSituationEvidence[];
};

export type ExecutiveSituationCandidate = {
  id: string;
  title: string;
  summary: string;
  evidenceIds: string[];
  identityEvidenceIds?: string[];
  confidence: number;
};

export type ExecutiveSituationResult = {
  situations: ExecutiveSituationCandidate[];
  generatedAt: Date;
};
