// lib/kernel/reflection/index.ts
export { BasicReflectionEngine } from "./basic-reflection-engine";
export { InMemoryReflectionRepository } from "./in-memory-reflection-repository";

export type { ReflectionEngine } from "./reflection-engine";
export type { ReflectionRepository } from "./reflection-repository";

export type {
  ReflectionCreateInput,
  ReflectionInput,
  ReflectionKind,
  ReflectionRecord,
  ReflectionResult,
  ReflectionSeverity,
  ReflectionTarget,
  ReflectionTargetType,
} from "./types";