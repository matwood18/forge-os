// lib/demo/demo-session-builder.ts
import { DemoPipelineBuilder } from "./demo-pipeline-builder";

import type { DemoSession } from "./session";

export class DemoSessionBuilder {
  private readonly pipelineBuilder = new DemoPipelineBuilder();

  build(input = ""): DemoSession {
    const now = new Date();

    return {
      id: crypto.randomUUID(),
      createdAt: now,
      input,
      pipeline: this.pipelineBuilder.build(),
      timeline: {
        id: crypto.randomUUID(),
        input,
        startedAt: now,
        completedAt: now,
        items: [],
      },
    };
  }
}