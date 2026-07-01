import type { Event } from "@/lib/domain";
import type { EventStore } from "./event-store";
import type { EventIngestInput, EventIngestResult } from "./types";
import type { EventIngestor } from "./ingestor";

export class BasicEventIngestor implements EventIngestor {
  constructor(private readonly eventStore: EventStore) {}

  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    const event: Event = {
      id: crypto.randomUUID(),
      type: input.type,
      occurredAt: input.occurredAt ?? new Date(),
      source: input.source,
      payload: input.payload,
    };

    await this.eventStore.append(event);

    return {
      event,
      questions: [],
    };
  }
}