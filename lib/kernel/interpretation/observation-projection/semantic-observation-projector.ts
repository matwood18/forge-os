// lib/kernel/interpretation/observation-projection/semantic-observation-projector.ts
import type { ObservationRecord } from "@/lib/kernel/observation";

import type { InterpretationRecord } from "../interpretation-record";
import type {
  SemanticObservationProjectionPolicyDecision,
} from "./policy";

export type SemanticObservationProjectionInput = {
  interpretation: InterpretationRecord;
};

export type SemanticObservationProjectionResult = {
  observations: ObservationRecord[];
  decisions: SemanticObservationProjectionPolicyDecision[];
};

export interface SemanticObservationProjector {
  project(
    input: SemanticObservationProjectionInput
  ): Promise<SemanticObservationProjectionResult>;
}