// lib/kernel/interpretation/observation-projection/materialization/semantic-observation-materializer.ts
import type { GroundingDecision, GroundingRecord } from "@/lib/kernel/grounding";
import type { ObservationCreateInput } from "@/lib/kernel/observation";

export type SemanticObservationMaterializationInput = {
  grounding: GroundingRecord;
  decision: GroundingDecision;
};

export type SemanticObservationMaterializationResult =
  | {
      materialized: true;
      observation: ObservationCreateInput;
      rationale: string;
    }
  | {
      materialized: false;
      rationale: string;
    };

export interface SemanticObservationMaterializer {
  materialize(
    input: SemanticObservationMaterializationInput
  ): SemanticObservationMaterializationResult;
}