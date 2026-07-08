// lib/kernel/interpretation/observation-projection/basic-semantic-observation-projector.ts
import type {
  ObservationCreateInput,
  ObservationRepository,
} from "@/lib/kernel/observation";
import type { SemanticSignal } from "@/lib/kernel/interpretation";

import type {
  SemanticObservationProjectionInput,
  SemanticObservationProjectionResult,
  SemanticObservationProjector,
} from "./semantic-observation-projector";

export class BasicSemanticObservationProjector
  implements SemanticObservationProjector
{
  constructor(private readonly observationRepository: ObservationRepository) {}

  async project(
    input: SemanticObservationProjectionInput
  ): Promise<SemanticObservationProjectionResult> {
    const observations = [];

    for (const signal of input.interpretation.signals) {
      const observation = this.toObservation(input, signal);

      if (!observation) {
        continue;
      }

      observations.push(await this.observationRepository.remember(observation));
    }

    return { observations };
  }

  private toObservation(
    input: SemanticObservationProjectionInput,
    signal: SemanticSignal
  ): ObservationCreateInput | null {
    const objectValue = this.getObjectValue(signal);

    if (!objectValue) {
      return null;
    }

    return {
      subjectEntityId: "self",
      predicate: `semantic_${signal.kind}`,
      objectEntityId: null,
      objectValue,
      confidence: signal.confidence,
      sourceEventId: input.interpretation.sourceEvent.id,
    };
  }

  private getObjectValue(signal: SemanticSignal): string | null {
    if (typeof signal.payload.text === "string") {
      return signal.payload.text;
    }

    return signal.summary;
  }
}