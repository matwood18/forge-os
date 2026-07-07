// lib/kernel/recommendation/types.ts
import type { ReflectionRecord, ReflectionTarget } from "../reflection";

export type RecommendationKind =
  | "create_question"
  | "create_goal"
  | "revise_goal"
  | "create_plan"
  | "investigate"
  | "retry"
  | "inspect_artifact"
  | "no_action";

export type RecommendationStatus =
  | "proposed"
  | "accepted"
  | "rejected"
  | "expired";

export type RecommendationRecord = {
  id: string;

  executionId: string;

  kind: RecommendationKind;
  status: RecommendationStatus;

  title: string;
  rationale: string;

  sourceReflectionIds: string[];

  target?: ReflectionTarget;

  createdAt: Date;
  updatedAt: Date;
};

export type RecommendationCreateInput = Omit<
  RecommendationRecord,
  "id" | "createdAt" | "updatedAt"
>;

export type RecommendationInput = {
  executionId: string;
  reflections: ReflectionRecord[];
};

export type RecommendationResult = {
  recommendations: RecommendationRecord[];
};