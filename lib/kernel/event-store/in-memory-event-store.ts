import type { Event } from "@/lib/domain";
import type { EventStore } from "./event-store";

export class InMemoryEventStore implements EventStore {
  private readonly events: Event[] = [];

  async append(event: Event): Promise<void> {
    this.events.push(event);
  }

  async list(): Promise<Event[]> {
    return [...this.events];
  }

  async find(id: string): Promise<Event | null> {
    return this.events.find((event) => event.id === id) ?? null;
  }

  async clear(): Promise<void> {
    this.events.length = 0;
  }
}