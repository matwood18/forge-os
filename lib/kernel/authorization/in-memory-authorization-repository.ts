// lib/kernel/authorization/in-memory-authorization-repository.ts
import { randomUUID } from "crypto";

import type { AuthorizationRepository } from "./authorization-repository";
import type {
  AuthorizationDecision,
  AuthorizationDecisionCreateInput,
} from "./types";

export class InMemoryAuthorizationRepository
  implements AuthorizationRepository
{
  private readonly decisions: AuthorizationDecision[] = [];

  async remember(
    decision: AuthorizationDecisionCreateInput
  ): Promise<AuthorizationDecision> {
    const record: AuthorizationDecision = {
      ...decision,
      id: randomUUID(),
      appliedPolicyIds: [...decision.appliedPolicyIds],
      createdAt: new Date(),
    };

    this.decisions.push(record);

    return record;
  }

  async forExecution(
    executionId: string
  ): Promise<AuthorizationDecision[]> {
    return this.decisions
      .filter((decision) => decision.executionId === executionId)
      .map((decision) => this.copy(decision));
  }

  async forRecommendation(
    recommendationId: string
  ): Promise<AuthorizationDecision[]> {
    return this.decisions
      .filter(
        (decision) => decision.recommendationId === recommendationId
      )
      .map((decision) => this.copy(decision));
  }

  async all(): Promise<AuthorizationDecision[]> {
    return this.decisions.map((decision) => this.copy(decision));
  }

  private copy(
    decision: AuthorizationDecision
  ): AuthorizationDecision {
    return {
      ...decision,
      appliedPolicyIds: [...decision.appliedPolicyIds],
    };
  }
}