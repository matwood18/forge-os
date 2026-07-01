import { BasicEventIngestor } from "./event-engine";
import type { EventIngestInput, EventIngestResult } from "./event-engine";

export class ForgeKernel {
  private readonly eventIngestor = new BasicEventIngestor();

  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    return this.eventIngestor.ingest(input);
  }
}