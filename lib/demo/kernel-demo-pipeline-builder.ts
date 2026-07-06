import type { Event, Question } from "@/lib/domain";
import type { KernelExecution, KernelExecutionStep } from "@/lib/kernel";
import type { MemoryRecord } from "@/lib/kernel/memory";
import type { ObservationRecord } from "@/lib/kernel/observation";
import type { ReasoningSession } from "@/lib/kernel/reasoning";
import type { RelationshipRecord } from "@/lib/kernel/relationship";

import { DemoPipelineBuilder } from "./demo-pipeline-builder";
import type { DemoArtifact, DemoPipeline, DemoStage, DemoStageId } from "./types";

export class KernelDemoPipelineBuilder {
  private readonly basePipelineBuilder = new DemoPipelineBuilder();

  build(execution: KernelExecution): DemoPipeline {
    return this.withArtifacts(this.basePipelineBuilder.build(), {
      input: this.inputArtifacts(execution),
      events: this.eventArtifacts(execution),
      "semantic-events": [
        this.createNotYetExposedArtifact(
          "Semantic event execution is not exposed yet."
        ),
      ],
      observations: this.observationArtifacts(execution),
      relationships: this.relationshipArtifacts(execution),
      memories: this.memoryArtifacts(execution),
      beliefs: [
        this.createNotYetExposedArtifact("Belief execution is not exposed yet."),
      ],
      worldview: [
        this.createNotYetExposedArtifact(
          "Worldview synthesis is not exposed yet."
        ),
      ],
      arguments: this.argumentArtifacts(execution),
      questions: this.questionArtifacts(execution),
    });
  }

  private withArtifacts(
    pipeline: DemoPipeline,
    artifactsByStage: Partial<Record<DemoStageId, DemoArtifact[]>>
  ): DemoPipeline {
    return {
      stages: pipeline.stages.map((stage): DemoStage => ({
        ...stage,
        artifacts: artifactsByStage[stage.id] ?? stage.artifacts,
      })),
    };
  }

  private inputArtifacts(execution: KernelExecution): DemoArtifact[] {
    return execution.steps
      .filter((step) => step.type === "input.received")
      .map((step) => this.createInputArtifact(step.artifact as string, step));
  }

  private eventArtifacts(execution: KernelExecution): DemoArtifact[] {
    return execution.steps
      .filter((step) => step.type === "event.created")
      .map((step) => this.createEventArtifact(step.artifact as Event, step));
  }

  private observationArtifacts(execution: KernelExecution): DemoArtifact[] {
    return execution.steps
      .filter((step) => step.type === "observation.available")
      .map((step) =>
        this.createObservationArtifact(step.artifact as ObservationRecord, step)
      );
  }

  private relationshipArtifacts(execution: KernelExecution): DemoArtifact[] {
    return execution.steps
      .filter((step) => step.type === "relationship.inferred")
      .map((step) =>
        this.createRelationshipArtifact(step.artifact as RelationshipRecord, step)
      );
  }

  private memoryArtifacts(execution: KernelExecution): DemoArtifact[] {
    return execution.steps
      .filter((step) => step.type === "memory.available")
      .map((step) =>
        this.createMemoryArtifact(step.artifact as MemoryRecord, step)
      );
  }

  private argumentArtifacts(execution: KernelExecution): DemoArtifact[] {
    return execution.steps
      .filter((step) => step.type === "reasoning.completed")
      .flatMap((step) =>
        this.createArgumentArtifacts(step.artifact as ReasoningSession, step)
      );
  }

  private questionArtifacts(execution: KernelExecution): DemoArtifact[] {
    return execution.steps
      .filter((step) => step.type === "question.created")
      .map((step) =>
        this.createQuestionArtifact(step.artifact as Question, step)
      );
  }

  private createInputArtifact(
    input: string,
    step: KernelExecutionStep
  ): DemoArtifact {
    return {
      id: step.id,
      title: "Raw capture text",
      summary: input,
      metadata: this.createStepMetadata(step, {
        length: input.length,
      }),
    };
  }

  private createEventArtifact(
    event: Event,
    step: KernelExecutionStep
  ): DemoArtifact {
    return {
      id: event.id,
      title: event.type,
      summary: `Captured from ${event.source}.`,
      details: [this.formatPayload(event.payload)],
      metadata: this.createStepMetadata(step, {
        source: event.source,
        occurredAt: event.occurredAt.toISOString(),
      }),
    };
  }

  private createObservationArtifact(
    observation: ObservationRecord,
    step: KernelExecutionStep
  ): DemoArtifact {
    return {
      id: observation.id,
      title: observation.predicate,
      summary: this.formatObservationObject(observation),
      metadata: this.createStepMetadata(step, {
        subjectEntityId: observation.subjectEntityId,
        objectEntityId: observation.objectEntityId ?? null,
        objectValue: observation.objectValue ?? null,
        confidence: observation.confidence,
        sourceEventId: observation.sourceEventId ?? null,
        createdAt: observation.createdAt.toISOString(),
        updatedAt: observation.updatedAt.toISOString(),
      }),
    };
  }

  private createRelationshipArtifact(
    relationship: RelationshipRecord,
    step: KernelExecutionStep
  ): DemoArtifact {
    return {
      id: relationship.id,
      title: relationship.predicate,
      summary: `${relationship.subjectEntityId} → ${relationship.objectEntityId}`,
      details: relationship.supportingObservationIds.map(
        (observationId) => `Supported by observation ${observationId}`
      ),
      metadata: this.createStepMetadata(step, {
        confidence: relationship.confidence,
        createdAt: relationship.createdAt.toISOString(),
        updatedAt: relationship.updatedAt.toISOString(),
      }),
    };
  }

  private createMemoryArtifact(
    memory: MemoryRecord,
    step: KernelExecutionStep
  ): DemoArtifact {
    return {
      id: memory.id,
      title: memory.predicate,
      summary: this.formatMemoryObject(memory),
      details: [
        `Kind: ${memory.kind}`,
        `Status: ${memory.status}`,
        `Confidence: ${memory.confidence}`,
      ],
      metadata: this.createStepMetadata(step, {
        subjectEntityId: memory.subjectEntityId,
        objectEntityId: memory.objectEntityId ?? null,
        objectValue: memory.objectValue ?? null,
        firstLearnedAt: memory.firstLearnedAt.toISOString(),
        lastConfirmedAt: memory.lastConfirmedAt.toISOString(),
      }),
    };
  }

  private createArgumentArtifacts(
    reasoningSession: ReasoningSession,
    step: KernelExecutionStep
  ): DemoArtifact[] {
    return reasoningSession.arguments.map((argument) => ({
      id: argument.id,
      title: argument.claim,
      summary: `${argument.status} argument with ${argument.strength} strength.`,
      details: [
        `Confidence: ${argument.confidence}`,
        `Supporting beliefs: ${argument.supportingBeliefIds.length}`,
        `Assumptions: ${argument.assumptionIds.length}`,
        `Questions raised: ${argument.generatedQuestionIds.length}`,
      ],
      metadata: this.createStepMetadata(step, {
        reasoningSessionId: reasoningSession.id,
        createdAt: reasoningSession.createdAt.toISOString(),
      }),
    }));
  }

  private createQuestionArtifact(
    question: Question,
    step: KernelExecutionStep
  ): DemoArtifact {
    return {
      id: question.id,
      title: question.prompt,
      summary: `${question.type} question with impact ${question.impact}.`,
      details: question.options?.map((option) => option.label) ?? [],
      metadata: this.createStepMetadata(step, {
        status: question.status,
        createdAt: question.createdAt.toISOString(),
      }),
    };
  }

  private createNotYetExposedArtifact(summary: string): DemoArtifact {
    return {
      id: crypto.randomUUID(),
      title: "Not exposed yet",
      summary,
    };
  }

  private createStepMetadata(
    step: KernelExecutionStep,
    metadata: NonNullable<DemoArtifact["metadata"]>
  ): NonNullable<DemoArtifact["metadata"]> {
    return {
      ...metadata,
      executionStepId: step.id,
      executionStepType: step.type,
      executionStepSequence: step.sequence,
      executionStepOccurredAt: step.occurredAt.toISOString(),
    };
  }

  private formatPayload(payload: unknown): string {
    if (typeof payload === "string") {
      return payload;
    }

    if (payload === null || payload === undefined) {
      return "No payload.";
    }

    if (typeof payload === "object") {
      return JSON.stringify(payload, null, 2);
    }

    return String(payload);
  }

  private formatObservationObject(observation: ObservationRecord): string {
    if (observation.objectEntityId) {
      return `${observation.subjectEntityId} ${observation.predicate} ${observation.objectEntityId}`;
    }

    if (observation.objectValue) {
      return `${observation.subjectEntityId} ${observation.predicate} ${observation.objectValue}`;
    }

    return `${observation.subjectEntityId} ${observation.predicate}`;
  }

  private formatMemoryObject(memory: MemoryRecord): string {
    if (memory.objectEntityId) {
      return `${memory.subjectEntityId} ${memory.predicate} ${memory.objectEntityId}`;
    }

    if (memory.objectValue) {
      return `${memory.subjectEntityId} ${memory.predicate} ${memory.objectValue}`;
    }

    return `${memory.subjectEntityId} ${memory.predicate}`;
  }
}