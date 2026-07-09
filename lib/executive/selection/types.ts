import type { ExecutiveComparedPriority } from "@/lib/executive/comparison";

export type ExecutiveSelectionSignalKind =
  | "highConsequence"
  | "requiresUserAttention"
  | "relationshipRisk"
  | "futureCost";

export type ExecutiveSelectionSignal = {
  kind: ExecutiveSelectionSignalKind;
  label: string;
  weight: number;
  evidenceIds: string[];
};

export type ExecutiveSelectionInput = {
  priorities: ExecutiveComparedPriority[];
  generatedAt: Date;
};

export type ExecutiveSelectionDecision = {
  priority: ExecutiveComparedPriority;
  decision: "surface" | "quiet";
  selectionSignals: ExecutiveSelectionSignal[];
  originalIndex: number;
};

export type ExecutiveSelectionResult = {
  decisions: ExecutiveSelectionDecision[];
  generatedAt: Date;
};
