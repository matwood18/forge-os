// lib/kernel/interpretation/interpretation-record.ts
import type { DomainEvent } from "@/lib/kernel/events";
import type { SemanticEvent } from "@/lib/kernel/semantic-events";

export type SemanticSignalKind =
  | "commitment"
  | "concern"
  | "intention"
  | "person_reference"
  | "relationship_impact"
  | "repeated_failure_mode"
  | "temporal_reference"
  | "unresolved_obligation";

export type SemanticSignal = {
  id: string;
  kind: SemanticSignalKind;
  label: string;
  summary: string;
  confidence: number;
  payload: Record<string, unknown>;
};

export type InterpretationRecord = {
  id: string;
  sourceEvent: DomainEvent;
  interpretedAt: Date;
  signals: SemanticSignal[];
  semanticEvents: SemanticEvent[];
};