// lib/kernel/reflection/basic-reflection-engine.ts
import type { CognitivePassExecution } from "../cognitive-pipeline";
import type { KernelExecutionStep } from "../execution";

import type { ReflectionRepository } from "./reflection-repository";
import type { ReflectionEngine } from "./reflection-engine";
import type {
  ReflectionCreateInput,
  ReflectionInput,
  ReflectionRecord,
  ReflectionResult,
} from "./types";

export class BasicReflectionEngine implements ReflectionEngine {
  constructor(private readonly repository: ReflectionRepository) {}

  async reflect(input: ReflectionInput): Promise<ReflectionResult> {
    const candidates = this.analyze(input);
    const reflections: ReflectionRecord[] = [];

    for (const candidate of candidates) {
      reflections.push(await this.repository.remember(candidate));
    }

    return {
      reflections,
    };
  }

  private analyze(input: ReflectionInput): ReflectionCreateInput[] {
    const { execution } = input;

    return [
      this.createExecutionSummary(input),
      ...this.createMissingPassExecutionReflections(input),
      ...this.createSparseExecutionReflections(input),
      ...this.createEmptyReasoningReflections(input),
      ...execution.passExecutions.flatMap((passExecution) =>
        this.createPassExecutionReflections(
          execution.id,
          passExecution
        )
      ),
    ];
  }

  private createExecutionSummary(
    input: ReflectionInput
  ): ReflectionCreateInput {
    const { execution } = input;

    const completedPasses = execution.passExecutions.filter(
      (passExecution) => passExecution.status === "completed"
    ).length;

    const failedPasses = execution.passExecutions.filter(
      (passExecution) => passExecution.status === "failed"
    ).length;

    return {
      executionId: execution.id,
      kind: "execution_summary",
      severity: failedPasses > 0 ? "warning" : "info",
      title: "Execution reviewed",
      summary:
        `Execution recorded ${execution.steps.length} steps and ` +
        `${execution.passExecutions.length} pass executions: ` +
        `${completedPasses} completed and ${failedPasses} failed.`,
      target: {
        type: "execution",
        id: execution.id,
      },
    };
  }

  private createMissingPassExecutionReflections(
    input: ReflectionInput
  ): ReflectionCreateInput[] {
    const { execution } = input;

    if (execution.passExecutions.length > 0) {
      return [];
    }

    return [
      {
        executionId: execution.id,
        kind: "pipeline_behavior",
        severity: "warning",
        title: "No pass executions recorded",
        summary:
          "The execution completed without recording any cognitive pass executions.",
        target: {
          type: "execution",
          id: execution.id,
        },
      },
    ];
  }

  private createSparseExecutionReflections(
    input: ReflectionInput
  ): ReflectionCreateInput[] {
    const { execution } = input;

    if (execution.steps.length > 2) {
      return [];
    }

    return [
      {
        executionId: execution.id,
        kind: "artifact_quality",
        severity: "warning",
        title: "Execution produced no cognitive output steps",
        summary:
          "The execution recorded no steps beyond initial input and event handling.",
        target: {
          type: "execution",
          id: execution.id,
        },
      },
    ];
  }

  private createEmptyReasoningReflections(
    input: ReflectionInput
  ): ReflectionCreateInput[] {
    const { execution } = input;

    return execution.steps
      .filter((step) => step.type === "reasoning.completed")
      .filter((step) => this.isEmptyReasoningStep(step))
      .map((step) => ({
        executionId: execution.id,
        kind: "artifact_quality",
        severity: "warning",
        title: "Reasoning completed without arguments",
        summary:
          "The reasoning pass completed, but it did not produce any arguments or questions.",
        target: {
          type: "step",
          id: step.id,
        },
      }));
  }

  private createPassExecutionReflections(
    executionId: string,
    passExecution: CognitivePassExecution
  ): ReflectionCreateInput[] {
    if (passExecution.status === "failed") {
      return [
        {
          executionId,
          kind: "risk",
          severity: "critical",
          title: `Pass failed: ${passExecution.passName}`,
          summary:
            passExecution.errorMessage ??
            "The cognitive pass failed without recording an error message.",
          target: {
            type: "pass_execution",
            id: passExecution.id,
          },
        },
      ];
    }

    if (this.countProducedArtifacts(passExecution) === 0) {
      return [
        {
          executionId,
          kind: "pipeline_behavior",
          severity: "info",
          title: `Pass produced no artifacts: ${passExecution.passName}`,
          summary:
            "The cognitive pass completed successfully without producing new artifacts.",
          target: {
            type: "pass_execution",
            id: passExecution.id,
          },
        },
      ];
    }

    return [];
  }

  private isEmptyReasoningStep(
    step: KernelExecutionStep
  ): boolean {
    if (step.type !== "reasoning.completed") {
      return false;
    }

    if (
      typeof step.artifact !== "object" ||
      step.artifact === null ||
      !("arguments" in step.artifact)
    ) {
      return false;
    }

    return step.artifact.arguments.length === 0;
  }

  private countProducedArtifacts(
    passExecution: CognitivePassExecution
  ): number {
    return Object.values(passExecution.artifacts).reduce(
      (total, count) => total + count,
      0
    );
  }
}