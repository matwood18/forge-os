// lib/kernel/interpretation/observation-projection/basic-semantic-observation-projector.ts
import type {
  ObservationRepository,
} from "@/lib/kernel/observation";

import {
  BasicSemanticObservationProjectionPolicy,
  type SemanticObservationProjectionPolicy,
} from "./policy";
import type {
  SemanticObservationProjectionInput,
  SemanticObservationProjectionResult,
  SemanticObservationProjector,
} from "./semantic-observation-projector";

export class BasicSemanticObservationProjector
  implements SemanticObservationProjector
{
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly policy: SemanticObservationProjectionPolicy =
      new BasicSemanticObservationProjectionPolicy()
  ) {}

  async project(
    input: SemanticObservationProjectionInput
  ): Promise<SemanticObservationProjectionResult> {
    const observations = [];
    const decisions = [];

    for (const signal of input.interpretation.signals) {
      const decision = this.policy.decide({
        interpretation: input.interpretation,
        signal,
      });

      decisions.push(decision);

      if (!decision.eligible) {
        continue;
      }

      observations.push(
        await this.observationRepository.remember(decision.observation)
      );
    }

    return {
      observations,
      decisions,
    };
  }
}