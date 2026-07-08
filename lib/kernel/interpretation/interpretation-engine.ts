// lib/kernel/interpretation/interpretation-engine.ts
import type { Event } from "@/lib/domain";
import type { SemanticEvent } from "@/lib/kernel/semantic-events";

import type {
  InterpretationRecord,
  SemanticSignal,
} from "./interpretation-record";

export type InterpretationEngineResult = {
  record: InterpretationRecord;
  signals: SemanticSignal[];
  semanticEvents: SemanticEvent[];
};

export interface InterpretationEngine {
  interpret(event: Event): Promise<InterpretationEngineResult>;
}