// lib/demo/recommendation/recommendation-inspector-builder.ts
import type { KernelExecution } from "@/lib/kernel/execution";
import type { RecommendationRecord } from "@/lib/kernel/recommendation";

import type { RecommendationInspector } from "./types";

export class RecommendationInspectorBuilder {
  build(
    execution: KernelExecution,
    recommendations: RecommendationRecord[]
  ): RecommendationInspector {
    return {
      id: execution.id,
      items: recommendations
        .filter(
          (recommendation) =>
            recommendation.executionId === execution.id
        )
        .map((recommendation) => ({
          id: recommendation.id,
          executionId: recommendation.executionId,
          kind: recommendation.kind,
          status: recommendation.status,
          title: recommendation.title,
          rationale: recommendation.rationale,
          sourceReflectionIds: [...recommendation.sourceReflectionIds],
          target: recommendation.target,
          createdAt: recommendation.createdAt,
          updatedAt: recommendation.updatedAt,
        })),
    };
  }
}