// lib/kernel/execution/types.ts
import type { Event, Question } from "@/lib/domain";

import type { CognitivePassExecution } from "../cognitive-pipeline";
import type { InterpretationRecord } from "../interpretation";
import type { MemoryRecord } from "../memory";
import type { ObservationRecord } from "../observation";
import type { ReasoningSession } from "../reasoning";
import type { RelationshipRecord } from "../relationship";

export type KernelExecutionStepType =
  | "input.received"
  | "event.created"
  | "semantic_interpretation.completed"
  | "observation.available"
  | "relationship.inferred"
  | "memory.available"
  | "reasoning.completed"
  | "question.created";

export type KernelExecutionStepArtifact =
  | string
  | Event
  | InterpretationRecord
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
  passExecutions: CognitivePassExecution[];
};