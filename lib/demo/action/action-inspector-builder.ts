// lib/demo/action/action-inspector-builder.ts
import type { ActionRecord } from "@/lib/kernel/action";
import type { KernelExecution } from "@/lib/kernel/execution";

import type { ActionInspector } from "./types";

export class ActionInspectorBuilder {
  build(
    execution: KernelExecution,
    actions: ActionRecord[]
  ): ActionInspector {
    return {
      id: execution.id,
      items: actions
        .filter((action) => action.executionId === execution.id)
        .map((action) => ({
          id: action.id,
          executionId: action.executionId,
          recommendationId: action.recommendationId,
          authorizationDecisionId: action.authorizationDecisionId,
          kind: action.kind,
          status: action.status,
          title: action.title,
          rationale: action.rationale,
          createdAt: action.createdAt,
          updatedAt: action.updatedAt,
        })),
    };
  }
}