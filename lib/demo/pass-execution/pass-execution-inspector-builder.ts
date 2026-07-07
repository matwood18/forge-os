// lib/demo/pass-execution/pass-execution-inspector-builder.ts
import type { KernelExecution } from "@/lib/kernel/execution";

import type { PassExecutionInspector } from "./types";

export class PassExecutionInspectorBuilder {
  build(execution: KernelExecution): PassExecutionInspector {
    return {
      id: execution.id,
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      items: execution.passExecutions.map((passExecution) => ({
        id: passExecution.id,
        passName: passExecution.passName,
        status: passExecution.status,
        startedAt: passExecution.startedAt,
        completedAt: passExecution.completedAt,
        durationMs: passExecution.metrics.durationMs,
        artifacts: passExecution.artifacts,
        metrics: passExecution.metrics,
        errorMessage: passExecution.errorMessage,
      })),
    };
  }
}