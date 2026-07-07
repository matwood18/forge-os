// lib/kernel/recommendation/recommendation-engine.ts
import type {
  RecommendationInput,
  RecommendationResult,
} from "./types";

export interface RecommendationEngine {
  recommend(
    input: RecommendationInput
  ): Promise<RecommendationResult>;
}