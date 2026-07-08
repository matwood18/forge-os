// lib/kernel/interpretation/index.ts
export type {
  InterpretationEngine,
  InterpretationEngineResult,
} from "@/lib/kernel/interpretation/interpretation-engine";

export type {
  InterpretationRecord,
  SemanticSignal,
  SemanticSignalKind,
} from "@/lib/kernel/interpretation/interpretation-record";

export type { InterpretationRepository } from "@/lib/kernel/interpretation/interpretation-repository";

export { BasicInterpretationEngine } from "@/lib/kernel/interpretation/basic-interpretation-engine";
export { InMemoryInterpretationRepository } from "@/lib/kernel/interpretation/in-memory-interpretation-repository";