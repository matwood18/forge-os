// lib/kernel/interpretation/interpretation-engine.ts
import type { DomainEvent } from "@/lib/kernel/events";
import type { SemanticEvent } from "@/lib/kernel/semantic-events";

import type { InterpretationRecord, SemanticSignal } from "./interpretation-record";

export type InterpretationEngineResult = {
  record: InterpretationRecord;
  signals: SemanticSignal[];
  semanticEvents: SemanticEvent[];
};

export interface InterpretationEngine {
  interpret(event: DomainEvent): Promise<InterpretationEngineResult>;
}