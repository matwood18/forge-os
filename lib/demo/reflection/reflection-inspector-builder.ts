// lib/demo/reflection/reflection-inspector-builder.ts
import type { KernelExecution } from "@/lib/kernel/execution";
import type { ReflectionRecord } from "@/lib/kernel/reflection";

import type { ReflectionInspector } from "./types";

export class ReflectionInspectorBuilder {
  build(
    execution: KernelExecution,
    reflections: ReflectionRecord[]
  ): ReflectionInspector {
    return {
      id: execution.id,
      items: reflections
        .filter((reflection) => reflection.executionId === execution.id)
        .map((reflection) => ({
          id: reflection.id,
          executionId: reflection.executionId,
          kind: reflection.kind,
          severity: reflection.severity,
          title: reflection.title,
          summary: reflection.summary,
          target: reflection.target,
          createdAt: reflection.createdAt,
        })),
    };
  }
}