import type { EventPublisher } from "@/lib/kernel/event-bus";
import type { SemanticEvent } from "@/lib/kernel/semantic-events/semantic-event";

export class SemanticEventPublisher {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async publish(event: SemanticEvent): Promise<void> {
    await this.eventPublisher.publish(event);
  }

  async publishMany(events: SemanticEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}