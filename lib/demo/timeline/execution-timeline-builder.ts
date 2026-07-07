// lib/demo/timeline/execution-timeline-builder.ts
import type {
  KernelExecution,
  KernelExecutionStep,
} from "@/lib/kernel/execution";

import type {
  ExecutionTimeline,
  ExecutionTimelineItem,
  ExecutionTimelineItemKind,
  ExecutionTimelineMetadataValue,
} from "./types";

export class ExecutionTimelineBuilder {
  build(execution: KernelExecution): ExecutionTimeline {
    return {
      id: execution.id,
      input: execution.input,
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      items: execution.steps.map((step) => this.buildItem(step)),
    };
  }

  private buildItem(step: KernelExecutionStep): ExecutionTimelineItem {
    return {
      id: step.id,
      sequence: step.sequence,
      kind: this.getKind(step.type),
      type: step.type,
      title: step.label,
      summary: this.summarize(step),
      occurredAt: step.occurredAt,
      metadata: this.getMetadata(step),
    };
  }

  private getKind(
    type: KernelExecutionStep["type"]
  ): ExecutionTimelineItemKind {
    switch (type) {
      case "input.received":
        return "input";
      case "event.created":
        return "event";
      case "observation.available":
        return "observation";
      case "relationship.inferred":
        return "relationship";
      case "memory.available":
        return "memory";
      case "reasoning.completed":
        return "reasoning";
      case "question.created":
        return "question";
      default:
        return "unknown";
    }
  }

  private summarize(step: KernelExecutionStep): string {
    const artifact = step.artifact;

    if (typeof artifact === "string") {
      return artifact;
    }

    if ("prompt" in artifact && typeof artifact.prompt === "string") {
      return artifact.prompt;
    }

    if ("summary" in artifact && typeof artifact.summary === "string") {
      return artifact.summary;
    }

    if ("claim" in artifact && typeof artifact.claim === "string") {
      return artifact.claim;
    }

    if ("label" in artifact && typeof artifact.label === "string") {
      return artifact.label;
    }

    if ("type" in artifact && typeof artifact.type === "string") {
      return artifact.type;
    }

    return "No summary available.";
  }

  private getMetadata(
    step: KernelExecutionStep
  ): Record<string, ExecutionTimelineMetadataValue> {
    const artifact = step.artifact;

    if (typeof artifact === "string") {
      return {
        length: artifact.length,
      };
    }

    return Object.entries(artifact).reduce<
      Record<string, ExecutionTimelineMetadataValue>
    >((metadata, [key, value]) => {
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        metadata[key] = value;
      }

      if (value instanceof Date) {
        metadata[key] = value.toISOString();
      }

      return metadata;
    }, {});
  }
}