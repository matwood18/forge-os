import type { Event } from "@/lib/domain";

export interface EventStore {
  append(event: Event): Promise<void>;

  list(): Promise<Event[]>;

  find(id: string): Promise<Event | null>;

  clear(): Promise<void>;
}