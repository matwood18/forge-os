import type { Event, Question } from "@/lib/domain";

import type { MemoryRecord } from "../memory";
import type { ObservationRecord } from "../observation";
import type { ReasoningSession } from "../reasoning";
import type { RelationshipRecord } from "../relationship";

export type KernelExecutionStepType =
  | "input.received"
  | "event.created"
  | "observation.available"
  | "relationship.inferred"
  | "memory.available"
  | "reasoning.completed"
  | "question.created";

export type KernelExecutionStepArtifact =
  | string
  | Event
  | ObservationRecord
  | RelationshipRecord
  | MemoryRecord
  | ReasoningSession
  | Question;

export type KernelExecutionStep = {
  id: string;
  sequence: number;
  type: KernelExecutionStepType;
  label: string;
  occurredAt: Date;
  artifact: KernelExecutionStepArtifact;
};

export type KernelExecution = {
  id: string;
  input: string;
  startedAt: Date;
  completedAt: Date;
  steps: KernelExecutionStep[];
};