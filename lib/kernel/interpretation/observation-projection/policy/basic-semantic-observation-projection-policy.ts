// lib/kernel/interpretation/observation-projection/policy/basic-semantic-observation-projection-policy.ts
import type {
  ObservationCreateInput,
} from "@/lib/kernel/observation";

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
    if (!PROJECTABLE_SIGNAL_KINDS.has(input.signal.kind)) {
      return {
        eligible: false,
        rationale: `Signal kind ${input.signal.kind} is not projection eligible.`,
      };
    }

    const objectValue = this.getObjectValue(input);

    if (!objectValue) {
      return {
        eligible: false,
        rationale: "Signal has no usable object value.",
      };
    }

    return {
      eligible: true,
      rationale: `Signal kind ${input.signal.kind} projected as semantic observation.`,
      observation: this.createObservation(input, objectValue),
    };
  }

  private createObservation(
    input: SemanticObservationProjectionPolicyInput,
    objectValue: string
  ): ObservationCreateInput {
    return {
      subjectEntityId: "self",
      predicate: this.getPredicate(input),
      objectEntityId: null,
      objectValue,
      confidence: input.signal.confidence,
      sourceEventId: input.interpretation.sourceEvent.id,
    };
  }

  private getPredicate(
    input: SemanticObservationProjectionPolicyInput
  ): string {
    return `semantic.${input.signal.kind}`;
  }

  private getObjectValue(
    input: SemanticObservationProjectionPolicyInput
  ): string | null {
    if (typeof input.signal.payload.text === "string") {
      return input.signal.payload.text;
    }

    return input.signal.summary;
  }
}