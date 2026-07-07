// lib/demo/authorization/authorization-decision-inspector-builder.ts
import type { AuthorizationDecision } from "@/lib/kernel/authorization";
import type { KernelExecution } from "@/lib/kernel/execution";

import type { AuthorizationDecisionInspector } from "./types";

export class AuthorizationDecisionInspectorBuilder {
  build(
    execution: KernelExecution,
    decisions: AuthorizationDecision[]
  ): AuthorizationDecisionInspector {
    return {
      id: execution.id,
      items: decisions
        .filter((decision) => decision.executionId === execution.id)
        .map((decision) => ({
          id: decision.id,
          executionId: decision.executionId,
          recommendationId: decision.recommendationId,
          outcome: decision.outcome,
          authority: decision.authority,
          rationale: decision.rationale,
          appliedPolicyIds: [...decision.appliedPolicyIds],
          createdAt: decision.createdAt,
        })),
    };
  }
}