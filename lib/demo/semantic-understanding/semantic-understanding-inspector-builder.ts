// lib/demo/semantic-understanding/semantic-understanding-inspector-builder.ts
import type {
  KernelExecution,
  KernelExecutionStep,
} from "@/lib/kernel/execution";
import type { InterpretationRecord } from "@/lib/kernel/interpretation";
import type { ObservationRecord } from "@/lib/kernel/observation";

import type { SemanticUnderstandingInspector } from "./types";

export class SemanticUnderstandingInspectorBuilder {
  build(execution: KernelExecution): SemanticUnderstandingInspector {
    const interpretation = this.findInterpretation(execution);
    const observations = this.findProjectedObservations(execution);

    return {
      id: execution.id,
      signals:
        interpretation?.signals.map((signal) => ({
          id: signal.id,
          kind: signal.kind,
          label: signal.label,
          summary: signal.summary,
          confidence: signal.confidence,
        })) ?? [],
      observations: observations.map((observation) => ({
        id: observation.id,
        predicate: observation.predicate,
        objectValue: observation.objectValue ?? null,
        confidence: observation.confidence,
      })),
    };
  }

  private findInterpretation(
    execution: KernelExecution
  ): InterpretationRecord | null {
    const step = execution.steps.find(
      (candidate) => candidate.type === "semantic_interpretation.completed"
    );

    if (!step || !this.isInterpretationRecord(step.artifact)) {
      return null;
    }

    return step.artifact;
  }

  private findProjectedObservations(
    execution: KernelExecution
  ): ObservationRecord[] {
    return execution.steps
      .filter((step) => step.type === "observation.available")
      .map((step) => step.artifact)
      .filter(this.isObservationRecord)
      .filter((observation) => observation.predicate.startsWith("semantic."));
  }

  private isInterpretationRecord(
    artifact: KernelExecutionStep["artifact"]
  ): artifact is InterpretationRecord {
    return (
      typeof artifact === "object" &&
      artifact !== null &&
      "signals" in artifact &&
      Array.isArray(artifact.signals) &&
      "semanticEvents" in artifact &&
      Array.isArray(artifact.semanticEvents)
    );
  }

  private isObservationRecord(
    artifact: KernelExecutionStep["artifact"]
  ): artifact is ObservationRecord {
    return (
      typeof artifact === "object" &&
      artifact !== null &&
      "predicate" in artifact &&
      typeof artifact.predicate === "string" &&
      "confidence" in artifact &&
      typeof artifact.confidence === "number"
    );
  }
}