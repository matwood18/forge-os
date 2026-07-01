import type { Event } from "@/lib/domain";
import type { EventIngestInput, EventIngestResult } from "./types";
import type { EventIngestor } from "./ingestor";

export class BasicEventIngestor implements EventIngestor {
  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    const event: Event = {
      id: crypto.randomUUID(),
      type: input.type,
      occurredAt: input.occurredAt ?? new Date(),
      source: input.source,
      payload: input.payload,
    };

    return {
      event,
      questions: [],
    };
  }
}