export type ExecutiveReasoningEvidence = {
  id: string;
  label: string;
  summary: string;
  confidence?: number;
  source?: string;
};

export type ExecutiveReasoningInput = {
  input: string;
  evidence: ExecutiveReasoningEvidence[];
};

export type ExecutiveReasonedPriority = {
  title: string;
  rationale: string;
  suggestedNextStep: string;
  evidenceIds: string[];
  confidence: number;
};

export type ExecutiveReasoningProviderKind =
  | "basic"
  | "openai";

export type ExecutiveReasoningResult = {
  priorities: ExecutiveReasonedPriority[];
  generatedAt: Date;
  provider: ExecutiveReasoningProviderKind;
};
