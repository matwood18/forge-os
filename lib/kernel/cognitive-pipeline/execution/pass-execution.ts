// lib/kernel/cognitive-pipeline/execution/pass-execution.ts
import type { CognitiveContextArtifacts } from "../types";

export type CognitivePassExecutionStatus = "completed" | "failed";

export type CognitivePassExecutionArtifactSummary = {
  reasoningSessions: number;
  observations: number;
  relationships: number;
  memories: number;
  questions: number;
  plans: number;
};

export type CognitivePassExecutionMetrics = {
  durationMs: number;
};

export type CognitivePassExecution = {
  id: string;
  passName: string;
  startedAt: Date;
  completedAt: Date;
  status: CognitivePassExecutionStatus;
  artifacts: CognitivePassExecutionArtifactSummary;
  metrics: CognitivePassExecutionMetrics;
  errorMessage?: string;
};

export function summarizeCognitiveArtifacts(
  artifacts: CognitiveContextArtifacts
): CognitivePassExecutionArtifactSummary {
  return {
    reasoningSessions: artifacts.reasoningSession ? 1 : 0,
    observations: artifacts.observations.length,
    relationships: artifacts.relationships.length,
    memories: artifacts.memories.length,
    questions: artifacts.questions.length,
    plans: artifacts.plans.length,
  };
}

export function diffCognitiveArtifactSummaries(
  before: CognitivePassExecutionArtifactSummary,
  after: CognitivePassExecutionArtifactSummary
): CognitivePassExecutionArtifactSummary {
  return {
    reasoningSessions: Math.max(
      after.reasoningSessions - before.reasoningSessions,
      0
    ),
    observations: Math.max(after.observations - before.observations, 0),
    relationships: Math.max(after.relationships - before.relationships, 0),
    memories: Math.max(after.memories - before.memories, 0),
    questions: Math.max(after.questions - before.questions, 0),
    plans: Math.max(after.plans - before.plans, 0),
  };
}