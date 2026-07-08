// lib/kernel/grounding/types.ts
import type { InterpretationRecord, SemanticSignal } from "@/lib/kernel/interpretation";

export type GroundingDecisionStatus =
  | "grounded"
  | "ambiguous"
  | "unresolved"
  | "ignored";

export type GroundingDecision = {
  id: string;
  signal: SemanticSignal;
  status: GroundingDecisionStatus;
  subjectEntityId: string | null;
  confidence: number;
  rationale: string;
};

export type GroundingRecord = {
  id: string;
  interpretation: InterpretationRecord;
  groundedAt: Date;
  decisions: GroundingDecision[];
};

export type GroundingEngineInput = {
  interpretation: InterpretationRecord;
};

export type GroundingEngineResult = {
  record: GroundingRecord;
};