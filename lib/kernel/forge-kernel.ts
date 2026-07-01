import type { Event } from "@/lib/domain";

import { BasicEventIngestor, InMemoryEventStore } from "./event-store";
import type { EventIngestInput, EventIngestResult } from "./event-store";

import { BasicReasoningEngine } from "./reasoning";
import type { ReasoningResult } from "./reasoning";

export class ForgeKernel {
  private readonly eventStore = new InMemoryEventStore();

  private readonly eventIngestor = new BasicEventIngestor(this.eventStore);

  private readonly reasoningEngine = new BasicReasoningEngine();

  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    return this.eventIngestor.ingest(input);
  }

  async reason(text: string): Promise<ReasoningResult> {
    return this.reasoningEngine.reason({ text });
  }

  async events(): Promise<Event[]> {
    return this.eventStore.list();
  }
}