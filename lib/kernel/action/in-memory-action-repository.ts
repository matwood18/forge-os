// lib/kernel/action/in-memory-action-repository.ts
import type { ActionRepository } from "./action-repository";
import type {
  ActionCreateInput,
  ActionRecord,
  ActionStatus,
} from "./types";

export class InMemoryActionRepository implements ActionRepository {
  private readonly actions: ActionRecord[] = [];

  async remember(action: ActionCreateInput): Promise<ActionRecord> {
    const now = new Date();

    const record: ActionRecord = {
      ...action,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.actions.push(record);

    return this.copy(record);
  }

  async byId(actionId: string): Promise<ActionRecord | null> {
    const action = this.actions.find((record) => record.id === actionId);

    if (!action) {
      return null;
    }

    return this.copy(action);
  }

  async updateStatus(
    actionId: string,
    status: ActionStatus
  ): Promise<ActionRecord | null> {
    const action = this.actions.find((record) => record.id === actionId);

    if (!action) {
      return null;
    }

    action.status = status;
    action.updatedAt = new Date();

    return this.copy(action);
  }

  async forExecution(executionId: string): Promise<ActionRecord[]> {
    return this.actions
      .filter((action) => action.executionId === executionId)
      .map((action) => this.copy(action));
  }

  async forRecommendation(
    recommendationId: string
  ): Promise<ActionRecord[]> {
    return this.actions
      .filter((action) => action.recommendationId === recommendationId)
      .map((action) => this.copy(action));
  }

  async forAuthorizationDecision(
    authorizationDecisionId: string
  ): Promise<ActionRecord[]> {
    return this.actions
      .filter(
        (action) =>
          action.authorizationDecisionId === authorizationDecisionId
      )
      .map((action) => this.copy(action));
  }

  async all(): Promise<ActionRecord[]> {
    return this.actions.map((action) => this.copy(action));
  }

  private copy(action: ActionRecord): ActionRecord {
    return {
      ...action,
      createdAt: new Date(action.createdAt),
      updatedAt: new Date(action.updatedAt),
    };
  }
}