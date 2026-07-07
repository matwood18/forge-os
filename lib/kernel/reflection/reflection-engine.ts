// lib/kernel/reflection/reflection-engine.ts
import type {
  ReflectionInput,
  ReflectionResult,
} from "./types";

export interface ReflectionEngine {
  reflect(input: ReflectionInput): Promise<ReflectionResult>;
}