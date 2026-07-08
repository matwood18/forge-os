// lib/kernel/interpretation/observation-projection/policy/semantic-observation-projection-policy.ts
import type {
  ObservationCreateInput,
} from "@/lib/kernel/observation";
import type {
  InterpretationRecord,
  SemanticSignal,
} from "@/lib/kernel/interpretation";

export type SemanticObservationProjectionPolicyInput = {
  interpretation: InterpretationRecord;
  signal: SemanticSignal;
};

export type SemanticObservationProjectionPolicyDecision =
  | {
      eligible: true;
      observation: ObservationCreateInput;
      rationale: string;
    }
  | {
      eligible: false;
      rationale: string;
    };

export interface SemanticObservationProjectionPolicy {
  decide(
    input: SemanticObservationProjectionPolicyInput
  ): SemanticObservationProjectionPolicyDecision;
}