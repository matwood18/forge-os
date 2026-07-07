// lib/kernel/cognitive-pipeline/execution/pass-execution-recorder.ts
import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

import {
  summarizeCognitiveArtifacts,
  type CognitivePassExecution,
} from "./pass-execution";

export class PassExecutionRecorder {
  async runPass(
    pass: CognitivePass,
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    const startedAt = new Date();

    try {
      await pass.run(context, environment);

      this.recordCompletedPass(pass, context, startedAt);
    } catch (error) {
      this.recordFailedPass(pass, context, startedAt, error);

      throw error;
    }
  }

  private recordCompletedPass(
    pass: CognitivePass,
    context: CognitiveContext,
    startedAt: Date
  ): void {
    const completedAt = new Date();

    context.metadata.passExecutions.push({
      id: crypto.randomUUID(),
      passName: pass.name,
      startedAt,
      completedAt,
      status: "completed",
      artifacts: summarizeCognitiveArtifacts(context.artifacts),
      metrics: {
        durationMs: completedAt.getTime() - startedAt.getTime(),
      },
    });
  }

  private recordFailedPass(
    pass: CognitivePass,
    context: CognitiveContext,
    startedAt: Date,
    error: unknown
  ): void {
    const completedAt = new Date();

    const execution: CognitivePassExecution = {
      id: crypto.randomUUID(),
      passName: pass.name,
      startedAt,
      completedAt,
      status: "failed",
      artifacts: summarizeCognitiveArtifacts(context.artifacts),
      metrics: {
        durationMs: completedAt.getTime() - startedAt.getTime(),
      },
      errorMessage:
        error instanceof Error ? error.message : "Unknown pass error",
    };

    context.metadata.passExecutions.push(execution);
  }
}