// lib/kernel/interpretation/observation-projection/semantic-observation-projector.ts
import type { GroundingRecord } from "@/lib/kernel/grounding";
import type { ObservationRecord } from "@/lib/kernel/observation";

import type { SemanticObservationProjectionPolicyDecision } from "./policy";

export type SemanticObservationProjectionInput = {
  grounding: GroundingRecord;
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