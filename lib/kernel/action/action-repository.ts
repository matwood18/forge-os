// lib/kernel/action/action-repository.ts
import type {
  ActionCreateInput,
  ActionRecord,
  ActionStatus,
} from "./types";

export interface ActionRepository {
  remember(action: ActionCreateInput): Promise<ActionRecord>;

  byId(actionId: string): Promise<ActionRecord | null>;

  updateStatus(
    actionId: string,
    status: ActionStatus
  ): Promise<ActionRecord | null>;

  forExecution(executionId: string): Promise<ActionRecord[]>;

  forRecommendation(recommendationId: string): Promise<ActionRecord[]>;

  forAuthorizationDecision(
    authorizationDecisionId: string
  ): Promise<ActionRecord[]>;

  all(): Promise<ActionRecord[]>;
}