// lib/kernel/authorization/types.ts
import type { RecommendationRecord } from "../recommendation";

export type AuthorizationDecisionOutcome =
  | "authorized"
  | "denied"
  | "deferred"
  | "requires_human_review";

export type AuthorizationDecisionAuthority =
  | "automatic"
  | "human";

export type AuthorizationDecision = {
  id: string;

  executionId: string;
  recommendationId: string;

  outcome: AuthorizationDecisionOutcome;
  authority: AuthorizationDecisionAuthority;

  rationale: string;

  appliedPolicyIds: string[];

  createdAt: Date;
};

export type AuthorizationDecisionCreateInput = Omit<
  AuthorizationDecision,
  "id" | "createdAt"
>;

export type AuthorizationInput = {
  executionId: string;
  recommendations: RecommendationRecord[];
};

export type AuthorizationResult = {
  decisions: AuthorizationDecision[];
};