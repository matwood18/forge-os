// lib/kernel/interpretation/observation-projection/materialization/basic-semantic-observation-materializer.ts
import type {
  SemanticObservationMaterializationInput,
  SemanticObservationMaterializationResult,
  SemanticObservationMaterializer,
} from "./semantic-observation-materializer";

export class BasicSemanticObservationMaterializer
  implements SemanticObservationMaterializer
{
  materialize(
    input: SemanticObservationMaterializationInput
  ): SemanticObservationMaterializationResult {
    if (input.decision.status !== "grounded") {
      return {
        materialized: false,
        rationale: `Grounding decision status ${input.decision.status} is not materializable.`,
      };
    }

    if (!input.decision.subjectEntityId) {
      return {
        materialized: false,
        rationale: "Grounding decision has no subject entity.",
      };
    }

    return {
      materialized: true,
      rationale: "Grounded semantic decision materialized as observation.",
      observation: {
        subjectEntityId: input.decision.subjectEntityId,
        predicate: `semantic.${input.decision.signal.kind}`,
        objectEntityId: null,
        objectValue: this.getObjectValue(input),
        confidence: Math.min(
          input.decision.confidence,
          input.decision.signal.confidence
        ),
        sourceEventId: input.grounding.interpretation.sourceEvent.id,
      },
    };
  }

  private getObjectValue(
    input: SemanticObservationMaterializationInput
  ): string {
    if (typeof input.decision.signal.payload.text === "string") {
      return input.decision.signal.payload.text;
    }

    return input.decision.signal.summary;
  }
}