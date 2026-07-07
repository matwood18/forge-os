// lib/kernel/recommendation/index.ts
export type {
  RecommendationCreateInput,
  RecommendationInput,
  RecommendationKind,
  RecommendationRecord,
  RecommendationResult,
  RecommendationStatus,
} from "./types";

export type { RecommendationEngine } from "./recommendation-engine";
export type { RecommendationRepository } from "./recommendation-repository";

export { BasicRecommendationEngine } from "./basic-recommendation-engine";
export { InMemoryRecommendationRepository } from "./in-memory-recommendation-repository";