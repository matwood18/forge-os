// lib/demo/semantic-understanding/types.ts
export type SemanticUnderstandingSignalItem = {
  id: string;
  kind: string;
  label: string;
  summary: string;
  confidence: number;
};

export type SemanticUnderstandingObservationItem = {
  id: string;
  predicate: string;
  objectValue: string | null;
  confidence: number;
};

export type SemanticUnderstandingInspector = {
  id: string;
  signals: SemanticUnderstandingSignalItem[];
  observations: SemanticUnderstandingObservationItem[];
};