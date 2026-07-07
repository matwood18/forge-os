// lib/demo/run-summary/run-summary-builder.ts
import type { DemoSession } from "../session";
import type {
  RunSummary,
  RunSummaryChainItem,
} from "./types";

type RunSummarySource = Omit<DemoSession, "runSummary">;

export class RunSummaryBuilder {
  build(session: RunSummarySource): RunSummary {
    const startedAt = session.timeline.startedAt;
    const completedAt = session.timeline.completedAt;

    const passCount = session.passExecutionInspector.items.length;
    const reflectionCount = session.reflectionInspector.items.length;
    const recommendationCount =
      session.recommendationInspector.items.length;
    const authorizationDecisionCount =
      session.authorizationDecisionInspector.items.length;
    const actionCount = session.actionInspector.items.length;

    const chainItems: RunSummaryChainItem[] = [
      {
        id: "input",
        label: "Input",
        description: "Forge received the source input for this run.",
        count: session.input ? 1 : 0,
        status: session.input ? "completed" : "empty",
      },
      {
        id: "execution",
        label: "Execution",
        description: "Cognitive passes processed the input.",
        count: passCount,
        status: passCount > 0 ? "completed" : "empty",
      },
      {
        id: "reflection",
        label: "Reflection",
        description: "Forge identified notable execution outcomes.",
        count: reflectionCount,
        status: reflectionCount > 0 ? "completed" : "empty",
      },
      {
        id: "recommendation",
        label: "Recommendation",
        description: "Forge proposed follow-up work from reflections.",
        count: recommendationCount,
        status: recommendationCount > 0 ? "completed" : "empty",
      },
      {
        id: "authorization",
        label: "Authorization",
        description: "Forge evaluated whether recommendations may proceed.",
        count: authorizationDecisionCount,
        status:
          authorizationDecisionCount > 0 ? "completed" : "empty",
      },
      {
        id: "action",
        label: "Action",
        description: "Forge materialized authorized intended work.",
        count: actionCount,
        status: actionCount > 0 ? "completed" : "empty",
      },
    ];

    return {
      id: session.id,
      input: session.input,
      startedAt,
      completedAt,
      durationMs: Math.max(
        0,
        completedAt.getTime() - startedAt.getTime()
      ),
      passCount,
      reflectionCount,
      recommendationCount,
      authorizationDecisionCount,
      actionCount,
      headline: this.buildHeadline({
        reflectionCount,
        recommendationCount,
        authorizationDecisionCount,
        actionCount,
      }),
      summary: this.buildSummary({
        passCount,
        reflectionCount,
        recommendationCount,
        authorizationDecisionCount,
        actionCount,
      }),
      chainItems,
    };
  }

  private buildHeadline(input: {
    reflectionCount: number;
    recommendationCount: number;
    authorizationDecisionCount: number;
    actionCount: number;
  }): string {
    if (input.actionCount > 0) {
      return "Forge completed cognition and materialized authorized intended work.";
    }

    if (input.authorizationDecisionCount > 0) {
      return "Forge completed cognition and evaluated proposed follow-up work.";
    }

    if (input.recommendationCount > 0) {
      return "Forge completed cognition and proposed follow-up work.";
    }

    if (input.reflectionCount > 0) {
      return "Forge completed cognition and identified notable outcomes.";
    }

    return "Forge completed cognition for this input.";
  }

  private buildSummary(input: {
    passCount: number;
    reflectionCount: number;
    recommendationCount: number;
    authorizationDecisionCount: number;
    actionCount: number;
  }): string {
    return [
      `${input.passCount} cognitive passes completed.`,
      `${input.reflectionCount} reflections were produced.`,
      `${input.recommendationCount} recommendations were proposed.`,
      `${input.authorizationDecisionCount} authorization decisions were recorded.`,
      `${input.actionCount} actions were materialized as durable intended work.`,
    ].join(" ");
  }
}