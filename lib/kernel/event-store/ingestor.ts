import type { EventIngestInput, EventIngestResult } from "./types";

export interface EventIngestor {
  ingest(input: EventIngestInput): Promise<EventIngestResult>;
}