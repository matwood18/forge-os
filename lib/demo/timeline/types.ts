// lib/demo/timeline/types.ts
import type { KernelExecutionStepType } from "@/lib/kernel/execution";

export type ExecutionTimelineItemKind =
  | "input"
  | "event"
  | "observation"
  | "relationship"
  | "memory"
  | "reasoning"
  | "question"
  | "unknown";

export type ExecutionTimelineMetadataValue =
  | string
  | number
  | boolean
  | null;

export type ExecutionTimelineItem = {
  id: string;
  sequence: number;
  kind: ExecutionTimelineItemKind;
  type: KernelExecutionStepType;
  title: string;
  summary: string;
  occurredAt: Date;
  metadata: Record<string, ExecutionTimelineMetadataValue>;
};

export type ExecutionTimeline = {
  id: string;
  input: string;
  startedAt: Date;
  completedAt: Date;
  items: ExecutionTimelineItem[];
};