// lib/kernel/action/basic-action-materialization-engine.ts
import type { AuthorizationDecision } from "../authorization";
import type { RecommendationRecord } from "../recommendation";

import type { ActionMaterializationEngine } from "./action-materialization-engine";
import type { ActionRepository } from "./action-repository";
import type {
  ActionCreateInput,
  ActionRecord,
} from "./types";
import type {
  ActionMaterializationInput,
  ActionMaterializationResult,
} from "./action-materialization-engine";

export class BasicActionMaterializationEngine
  implements ActionMaterializationEngine
{
  constructor(private readonly repository: ActionRepository) {}

  async materialize(
    input: ActionMaterializationInput
  ): Promise<ActionMaterializationResult> {
    const candidates = this.analyze(input);
    const actions: ActionRecord[] = [];

    for (const candidate of candidates) {
      actions.push(await this.repository.remember(candidate));
    }

    return {
      actions,
    };
  }

  private analyze(
    input: ActionMaterializationInput
  ): ActionCreateInput[] {
    const recommendationsById = new Map(
      input.recommendations
        .filter(
          (recommendation) =>
            recommendation.executionId === input.executionId
        )
        .map((recommendation) => [recommendation.id, recommendation])
    );

    return input.authorizationDecisions
      .filter(
        (decision) =>
          decision.executionId === input.executionId &&
          decision.outcome === "authorized"
      )
      .flatMap((decision) => {
        const recommendation = recommendationsById.get(
          decision.recommendationId
        );

        if (!recommendation) {
          return [];
        }

        return this.createActionsForAuthorizedRecommendation(
          recommendation,
          decision
        );
      });
  }

  private createActionsForAuthorizedRecommendation(
    recommendation: RecommendationRecord,
    decision: AuthorizationDecision
  ): ActionCreateInput[] {
    if (recommendation.kind === "investigate") {
      return [
        {
          executionId: recommendation.executionId,
          recommendationId: recommendation.id,
          authorizationDecisionId: decision.id,
          kind: "investigation",
          status: "pending",
          title: recommendation.title,
          rationale: recommendation.rationale,
        },
      ];
    }

    return [];
  }
}