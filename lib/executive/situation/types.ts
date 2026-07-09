export type ExecutiveSituationEvidence = {
  id: string;
  label: string;
  summary: string;
  confidence?: number;
  source?: string;
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
  confidence: number;
};

export type ExecutiveSituationResult = {
  situations: ExecutiveSituationCandidate[];
  generatedAt: Date;
};
