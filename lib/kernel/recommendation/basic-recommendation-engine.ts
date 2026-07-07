// lib/kernel/recommendation/basic-recommendation-engine.ts
import type { ReflectionRecord } from "../reflection";

import type { RecommendationEngine } from "./recommendation-engine";
import type { RecommendationRepository } from "./recommendation-repository";
import type {
  RecommendationCreateInput,
  RecommendationInput,
  RecommendationRecord,
  RecommendationResult,
} from "./types";

export class BasicRecommendationEngine implements RecommendationEngine {
  constructor(
    private readonly repository: RecommendationRepository
  ) {}

  async recommend(
    input: RecommendationInput
  ): Promise<RecommendationResult> {
    const candidates = this.analyze(input);
    const recommendations: RecommendationRecord[] = [];

    for (const candidate of candidates) {
      recommendations.push(await this.repository.remember(candidate));
    }

    return {
      recommendations,
    };
  }

  private analyze(
    input: RecommendationInput
  ): RecommendationCreateInput[] {
    return input.reflections
      .filter((reflection) => reflection.executionId === input.executionId)
      .flatMap((reflection) =>
        this.createRecommendationsForReflection(reflection)
      );
  }

  private createRecommendationsForReflection(
    reflection: ReflectionRecord
  ): RecommendationCreateInput[] {
    if (
      reflection.kind === "risk" &&
      reflection.severity === "critical"
    ) {
      return [
        this.createRecommendation(
          reflection,
          "retry",
          "Retry failed cognitive work",
          "A critical execution risk indicates that cognitive work failed and should be explicitly considered for retry."
        ),
      ];
    }

    if (
      reflection.kind === "artifact_quality" &&
      reflection.severity === "warning"
    ) {
      return [
        this.createRecommendation(
          reflection,
          "investigate",
          "Investigate missing cognitive output",
          "The execution produced insufficient cognitive output and should be investigated before further action is taken."
        ),
      ];
    }

    if (
      reflection.kind === "pipeline_behavior" &&
      reflection.severity === "warning"
    ) {
      return [
        this.createRecommendation(
          reflection,
          "investigate",
          "Investigate pipeline behavior",
          "The cognitive pipeline exhibited warning-level behavior that should be investigated."
        ),
      ];
    }

    return [];
  }

  private createRecommendation(
    reflection: ReflectionRecord,
    kind: RecommendationCreateInput["kind"],
    title: string,
    rationale: string
  ): RecommendationCreateInput {
    return {
      executionId: reflection.executionId,
      kind,
      status: "proposed",
      title,
      rationale,
      sourceReflectionIds: [reflection.id],
      target: reflection.target,
    };
  }
}