// lib/kernel/authorization/basic-authorization-engine.ts
import type { RecommendationRecord } from "../recommendation";

import type { AuthorizationEngine } from "./authorization-engine";
import type { AuthorizationRepository } from "./authorization-repository";
import type {
  AuthorizationDecision,
  AuthorizationDecisionCreateInput,
  AuthorizationInput,
  AuthorizationResult,
} from "./types";

export class BasicAuthorizationEngine implements AuthorizationEngine {
  constructor(
    private readonly repository: AuthorizationRepository
  ) {}

  async evaluate(
    input: AuthorizationInput
  ): Promise<AuthorizationResult> {
    const candidates = this.analyze(input);
    const decisions: AuthorizationDecision[] = [];

    for (const candidate of candidates) {
      decisions.push(await this.repository.remember(candidate));
    }

    return {
      decisions,
    };
  }

  private analyze(
    input: AuthorizationInput
  ): AuthorizationDecisionCreateInput[] {
    return input.recommendations
      .filter(
        (recommendation) =>
          recommendation.executionId === input.executionId
      )
      .flatMap((recommendation) =>
        this.createDecisionsForRecommendation(recommendation)
      );
  }

  private createDecisionsForRecommendation(
    recommendation: RecommendationRecord
  ): AuthorizationDecisionCreateInput[] {
    if (recommendation.kind === "retry") {
      return [
        this.createDecision(
          recommendation,
          "requires_human_review",
          "automatic",
          "Retry recommendations require human review because Forge does not yet have retry limits, idempotency guarantees, or action execution safeguards.",
          ["retry-requires-human-review"]
        ),
      ];
    }

    if (recommendation.kind === "investigate") {
      return [
        this.createDecision(
          recommendation,
          "authorized",
          "automatic",
          "Investigation recommendations are read-only in intent and may proceed toward future action planning without mutating kernel state.",
          ["investigate-auto-authorized"]
        ),
      ];
    }

    return [];
  }

  private createDecision(
    recommendation: RecommendationRecord,
    outcome: AuthorizationDecisionCreateInput["outcome"],
    authority: AuthorizationDecisionCreateInput["authority"],
    rationale: string,
    appliedPolicyIds: string[]
  ): AuthorizationDecisionCreateInput {
    return {
      executionId: recommendation.executionId,
      recommendationId: recommendation.id,
      outcome,
      authority,
      rationale,
      appliedPolicyIds,
    };
  }
}