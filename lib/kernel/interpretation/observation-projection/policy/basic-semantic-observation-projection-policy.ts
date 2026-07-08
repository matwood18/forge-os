// lib/kernel/interpretation/observation-projection/policy/basic-semantic-observation-projection-policy.ts
import type {
  SemanticObservationProjectionPolicy,
  SemanticObservationProjectionPolicyDecision,
  SemanticObservationProjectionPolicyInput,
} from "./semantic-observation-projection-policy";

const PROJECTABLE_SIGNAL_KINDS = new Set([
  "commitment",
  "concern",
  "relationship_impact",
  "repeated_failure_mode",
  "temporal_reference",
  "unresolved_obligation",
]);

export class BasicSemanticObservationProjectionPolicy
  implements SemanticObservationProjectionPolicy
{
  decide(
    input: SemanticObservationProjectionPolicyInput
  ): SemanticObservationProjectionPolicyDecision {
    if (input.decision.status !== "grounded") {
      return {
        eligible: false,
        rationale: `Grounding decision status ${input.decision.status} is not projection eligible.`,
      };
    }

    if (!PROJECTABLE_SIGNAL_KINDS.has(input.decision.signal.kind)) {
      return {
        eligible: false,
        rationale: `Signal kind ${input.decision.signal.kind} is not projection eligible.`,
      };
    }

    if (!this.hasObjectValue(input)) {
      return {
        eligible: false,
        rationale: "Grounded signal has no usable object value.",
      };
    }

    return {
      eligible: true,
      rationale: `Grounded signal kind ${input.decision.signal.kind} is projection eligible.`,
    };
  }

  private hasObjectValue(
    input: SemanticObservationProjectionPolicyInput
  ): boolean {
    if (typeof input.decision.signal.payload.text === "string") {
      return input.decision.signal.payload.text.trim().length > 0;
    }

    return input.decision.signal.summary.trim().length > 0;
  }
}