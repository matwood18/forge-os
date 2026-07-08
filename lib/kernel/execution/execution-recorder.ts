// lib/kernel/execution/execution-recorder.ts
import type { Event, Question } from "@/lib/domain";

import type { CognitivePassExecution } from "../cognitive-pipeline";
import type { GroundingRecord } from "../grounding";
import type { InterpretationRecord } from "../interpretation";
import type { MemoryRecord } from "../memory";
import type { ObservationRecord } from "../observation";
import type { ReasoningSession } from "../reasoning";
import type { RelationshipRecord } from "../relationship";

import type {
  KernelExecution,
  KernelExecutionStep,
  KernelExecutionStepArtifact,
  KernelExecutionStepType,
} from "./types";

export class KernelExecutionRecorder {
  private readonly id = crypto.randomUUID();
  private readonly startedAt = new Date();
  private readonly steps: KernelExecutionStep[] = [];
  private passExecutions: CognitivePassExecution[] = [];

  recordInput(input: string): void {
    this.record("input.received", "Input received", input);
  }

  recordEvent(event: Event): void {
    this.record("event.created", "Event created", event);
  }

  recordInterpretation(record: InterpretationRecord): void {
    this.record(
      "semantic_interpretation.completed",
      "Semantic interpretation completed",
      record
    );
  }

  recordGrounding(record: GroundingRecord): void {
    this.record("grounding.completed", "Grounding completed", record);
  }

  recordObservation(observation: ObservationRecord): void {
    this.record("observation.available", "Observation available", observation);
  }

  recordRelationship(relationship: RelationshipRecord): void {
    this.record("relationship.inferred", "Relationship inferred", relationship);
  }

  recordMemory(memory: MemoryRecord): void {
    this.record("memory.available", "Memory available", memory);
  }

  recordReasoning(reasoningSession: ReasoningSession): void {
    this.record("reasoning.completed", "Reasoning completed", reasoningSession);
  }

  recordQuestion(question: Question): void {
    this.record("question.created", "Question created", question);
  }

  recordPassExecutions(passExecutions: CognitivePassExecution[]): void {
    this.passExecutions = [...passExecutions];
  }

  complete(input: string): KernelExecution {
    return {
      id: this.id,
      input,
      startedAt: this.startedAt,
      completedAt: new Date(),
      steps: [...this.steps],
      passExecutions: [...this.passExecutions],
    };
  }

  private record(
    type: KernelExecutionStepType,
    label: string,
    artifact: KernelExecutionStepArtifact
  ): void {
    this.steps.push({
      id: crypto.randomUUID(),
      sequence: this.steps.length + 1,
      type,
      label,
      occurredAt: new Date(),
      artifact,
    });
  }
}