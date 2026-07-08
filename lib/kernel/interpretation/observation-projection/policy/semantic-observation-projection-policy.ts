// lib/kernel/interpretation/observation-projection/policy/semantic-observation-projection-policy.ts
import type { GroundingDecision, GroundingRecord } from "@/lib/kernel/grounding";

export type SemanticObservationProjectionPolicyInput = {
  grounding: GroundingRecord;
  decision: GroundingDecision;
};

export type SemanticObservationProjectionPolicyDecision = {
  eligible: boolean;
  rationale: string;
};

export interface SemanticObservationProjectionPolicy {
  decide(
    input: SemanticObservationProjectionPolicyInput
  ): SemanticObservationProjectionPolicyDecision;
}