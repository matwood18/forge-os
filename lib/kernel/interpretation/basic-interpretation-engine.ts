import type { DomainEvent } from "@/lib/kernel/events";
import type { SemanticEvent } from "@/lib/kernel/semantic-events";
import type { InterpretationEngine } from "./interpretation-engine";

export class BasicInterpretationEngine implements InterpretationEngine {
  async interpret(event: DomainEvent): Promise<SemanticEvent[]> {
    void event;

    return [];
  }
}