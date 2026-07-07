// lib/demo/pass-execution/types.ts
import type { CognitivePassExecution } from "@/lib/kernel/cognitive-pipeline";

export type PassExecutionInspectorItem = {
  id: string;
  passName: string;
  status: CognitivePassExecution["status"];
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
  artifacts: CognitivePassExecution["artifacts"];
  metrics: CognitivePassExecution["metrics"];
  errorMessage?: string;
};

export type PassExecutionInspector = {
  id: string;
  startedAt: Date;
  completedAt: Date;
  items: PassExecutionInspectorItem[];
};