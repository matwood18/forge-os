// lib/kernel/interpretation/observation-projection/semantic-observation-projector.ts
import type { ObservationRecord } from "@/lib/kernel/observation";

import type { InterpretationRecord } from "../interpretation-record";

export type SemanticObservationProjectionInput = {
  interpretation: InterpretationRecord;
};

export type SemanticObservationProjectionResult = {
  observations: ObservationRecord[];
};

export interface SemanticObservationProjector {
  project(
    input: SemanticObservationProjectionInput
  ): Promise<SemanticObservationProjectionResult>;
}