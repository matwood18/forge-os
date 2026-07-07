// lib/kernel/recommendation/recommendation-repository.ts
import type {
  RecommendationCreateInput,
  RecommendationRecord,
} from "./types";

export interface RecommendationRepository {
  remember(
    recommendation: RecommendationCreateInput
  ): Promise<RecommendationRecord>;

  forExecution(executionId: string): Promise<RecommendationRecord[]>;

  all(): Promise<RecommendationRecord[]>;
}