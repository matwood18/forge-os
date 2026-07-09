import type { ExecutiveReasonedPriority } from "@/lib/executive/reasoning";

export type ExecutiveComparisonSignalKind =
  | "deadline"
  | "personAffected"
  | "relationshipImpact"
  | "dependency"
  | "repeatedMention"
  | "blockedWork"
  | "staleness"
  | "concreteNextStep";

export type ExecutiveComparisonSignal = {
  kind: ExecutiveComparisonSignalKind;
  label: string;
  weight: number;
  evidenceIds: string[];
};

export type ExecutiveComparisonInput = {
  priorities: ExecutiveReasonedPriority[];
  generatedAt: Date;
};

export type ExecutiveComparedPriority = {
  priority: ExecutiveReasonedPriority;
  comparisonSignals: ExecutiveComparisonSignal[];
  executiveWeight: number;
  originalIndex: number;
};

export type ExecutiveComparisonResult = {
  priorities: ExecutiveComparedPriority[];
  generatedAt: Date;
};
