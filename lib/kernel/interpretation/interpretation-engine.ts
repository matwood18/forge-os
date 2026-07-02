import type { DomainEvent } from "@/lib/kernel/events";
import type { SemanticEvent } from "@/lib/kernel/semantic-events";

export interface InterpretationEngine {
  interpret(event: DomainEvent): Promise<SemanticEvent[]>;
}