// lib/demo/demo-session-builder.ts
import { DemoPipelineBuilder } from "./demo-pipeline-builder";
import { RunSummaryBuilder } from "./run-summary";

import type { DemoSession } from "./session";

export class DemoSessionBuilder {
  private readonly pipelineBuilder = new DemoPipelineBuilder();
  private readonly runSummaryBuilder = new RunSummaryBuilder();

  build(input = ""): DemoSession {
    const now = new Date();
    const sessionId = crypto.randomUUID();

    const sessionWithoutRunSummary: Omit<DemoSession, "runSummary"> = {
      id: sessionId,
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
      passExecutionInspector: {
        id: crypto.randomUUID(),
        startedAt: now,
        completedAt: now,
        items: [],
      },
      reflectionInspector: {
        id: crypto.randomUUID(),
        items: [],
      },
      recommendationInspector: {
        id: crypto.randomUUID(),
        items: [],
      },
      authorizationDecisionInspector: {
        id: crypto.randomUUID(),
        items: [],
      },
      actionInspector: {
        id: crypto.randomUUID(),
        items: [],
      },
      decisionChain: {
        id: sessionId,
        items: [],
      },
    };

    return {
      ...sessionWithoutRunSummary,
      runSummary: this.runSummaryBuilder.build(sessionWithoutRunSummary),
    };
  }
}