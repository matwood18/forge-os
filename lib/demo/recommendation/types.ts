// lib/demo/recommendation/types.ts
import type { RecommendationRecord } from "@/lib/kernel/recommendation";

export type RecommendationInspectorItem = {
  id: string;
  executionId: string;
  kind: RecommendationRecord["kind"];
  status: RecommendationRecord["status"];
  title: string;
  rationale: string;
  sourceReflectionIds: string[];
  target?: RecommendationRecord["target"];
  createdAt: Date;
  updatedAt: Date;
};

export type RecommendationInspector = {
  id: string;
  items: RecommendationInspectorItem[];
};