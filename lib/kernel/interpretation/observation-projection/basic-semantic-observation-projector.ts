// lib/kernel/interpretation/observation-projection/basic-semantic-observation-projector.ts
import type { ObservationRecord, ObservationRepository } from "@/lib/kernel/observation";

import {
  BasicSemanticObservationMaterializer,
  type SemanticObservationMaterializer,
} from "./materialization";
import {
  BasicSemanticObservationProjectionPolicy,
  type SemanticObservationProjectionPolicy,
  type SemanticObservationProjectionPolicyDecision,
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
      new BasicSemanticObservationProjectionPolicy(),
    private readonly materializer: SemanticObservationMaterializer =
      new BasicSemanticObservationMaterializer()
  ) {}

  async project(
    input: SemanticObservationProjectionInput
  ): Promise<SemanticObservationProjectionResult> {
    const observations: ObservationRecord[] = [];
    const decisions: SemanticObservationProjectionPolicyDecision[] = [];

    for (const groundingDecision of input.grounding.decisions) {
      const policyDecision = this.policy.decide({
        grounding: input.grounding,
        decision: groundingDecision,
      });

      decisions.push(policyDecision);

      if (!policyDecision.eligible) {
        continue;
      }

      const materializationResult = this.materializer.materialize({
        grounding: input.grounding,
        decision: groundingDecision,
      });

      if (!materializationResult.materialized) {
        continue;
      }

      observations.push(
        await this.observationRepository.remember(
          materializationResult.observation
        )
      );
    }

    return {
      observations,
      decisions,
    };
  }
}