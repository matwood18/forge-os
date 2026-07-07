// lib/kernel/cognitive-pipeline/execution/pass-execution-recorder.ts
import type { CognitiveEnvironment } from "../environment";
import type { CognitiveContext, CognitivePass } from "../types";

import {
  diffCognitiveArtifactSummaries,
  summarizeCognitiveArtifacts,
  type CognitivePassExecution,
  type CognitivePassExecutionArtifactSummary,
} from "./pass-execution";

export class PassExecutionRecorder {
  async runPass(
    pass: CognitivePass,
    context: CognitiveContext,
    environment: CognitiveEnvironment
  ): Promise<void> {
    const startedAt = new Date();
    const beforeArtifacts = summarizeCognitiveArtifacts(context.artifacts);

    try {
      await pass.run(context, environment);

      this.recordCompletedPass(pass, context, startedAt, beforeArtifacts);
    } catch (error) {
      this.recordFailedPass(pass, context, startedAt, beforeArtifacts, error);

      throw error;
    }
  }

  private recordCompletedPass(
    pass: CognitivePass,
    context: CognitiveContext,
    startedAt: Date,
    beforeArtifacts: CognitivePassExecutionArtifactSummary
  ): void {
    const completedAt = new Date();
    const afterArtifacts = summarizeCognitiveArtifacts(context.artifacts);

    context.metadata.passExecutions.push({
      id: crypto.randomUUID(),
      passName: pass.name,
      startedAt,
      completedAt,
      status: "completed",
      artifacts: diffCognitiveArtifactSummaries(
        beforeArtifacts,
        afterArtifacts
      ),
      metrics: {
        durationMs: completedAt.getTime() - startedAt.getTime(),
      },
    });
  }

  private recordFailedPass(
    pass: CognitivePass,
    context: CognitiveContext,
    startedAt: Date,
    beforeArtifacts: CognitivePassExecutionArtifactSummary,
    error: unknown
  ): void {
    const completedAt = new Date();
    const afterArtifacts = summarizeCognitiveArtifacts(context.artifacts);

    const execution: CognitivePassExecution = {
      id: crypto.randomUUID(),
      passName: pass.name,
      startedAt,
      completedAt,
      status: "failed",
      artifacts: diffCognitiveArtifactSummaries(
        beforeArtifacts,
        afterArtifacts
      ),
      metrics: {
        durationMs: completedAt.getTime() - startedAt.getTime(),
      },
      errorMessage:
        error instanceof Error ? error.message : "Unknown pass error",
    };

    context.metadata.passExecutions.push(execution);
  }
}