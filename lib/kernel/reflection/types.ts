// lib/kernel/reflection/types.ts
import type { KernelExecution } from "../execution";

export type ReflectionSeverity = "info" | "warning" | "critical";

export type ReflectionKind =
  | "execution_summary"
  | "artifact_quality"
  | "pipeline_behavior"
  | "risk"
  | "improvement"
  | "follow_up";

export type ReflectionTargetType =
  | "execution"
  | "step"
  | "pass_execution"
  | "artifact";

export type ReflectionTarget = {
  type: ReflectionTargetType;
  id: string;
};

export type ReflectionRecord = {
  id: string;

  executionId: string;

  kind: ReflectionKind;
  severity: ReflectionSeverity;

  title: string;
  summary: string;

  target?: ReflectionTarget;

  createdAt: Date;
};

export type ReflectionCreateInput = Omit<
  ReflectionRecord,
  "id" | "createdAt"
>;

export type ReflectionInput = {
  execution: KernelExecution;
};

export type ReflectionResult = {
  reflections: ReflectionRecord[];
};