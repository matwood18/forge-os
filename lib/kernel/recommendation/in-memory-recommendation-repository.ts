// lib/kernel/recommendation/in-memory-recommendation-repository.ts
import type { RecommendationRepository } from "./recommendation-repository";
import type {
  RecommendationCreateInput,
  RecommendationRecord,
} from "./types";

export class InMemoryRecommendationRepository
  implements RecommendationRepository
{
  private readonly recommendations: RecommendationRecord[] = [];

  async remember(
    recommendation: RecommendationCreateInput
  ): Promise<RecommendationRecord> {
    const now = new Date();

    const record: RecommendationRecord = {
      ...recommendation,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.recommendations.push(record);

    return record;
  }

  async forExecution(
    executionId: string
  ): Promise<RecommendationRecord[]> {
    return this.recommendations.filter(
      (recommendation) => recommendation.executionId === executionId
    );
  }

  async all(): Promise<RecommendationRecord[]> {
    return [...this.recommendations];
  }
}