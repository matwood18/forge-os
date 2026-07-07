// lib/kernel/authorization/authorization-repository.ts
import type {
  AuthorizationDecision,
  AuthorizationDecisionCreateInput,
} from "./types";

export interface AuthorizationRepository {
  remember(
    decision: AuthorizationDecisionCreateInput
  ): Promise<AuthorizationDecision>;

  forExecution(executionId: string): Promise<AuthorizationDecision[]>;

  forRecommendation(
    recommendationId: string
  ): Promise<AuthorizationDecision[]>;

  all(): Promise<AuthorizationDecision[]>;
}