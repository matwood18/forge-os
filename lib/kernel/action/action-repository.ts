// lib/kernel/action/action-repository.ts
import type { ActionCreateInput, ActionRecord } from "./types";

export interface ActionRepository {
  remember(action: ActionCreateInput): Promise<ActionRecord>;

  forExecution(executionId: string): Promise<ActionRecord[]>;

  forRecommendation(recommendationId: string): Promise<ActionRecord[]>;

  forAuthorizationDecision(
    authorizationDecisionId: string
  ): Promise<ActionRecord[]>;

  all(): Promise<ActionRecord[]>;
}