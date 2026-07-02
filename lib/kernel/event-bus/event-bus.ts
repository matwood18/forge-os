import type { EventPublisher } from "@/lib/kernel/event-bus/event-publisher";
import type { KernelEvent } from "@/lib/kernel/events/kernel-event";

export type EventHandler<TEvent extends KernelEvent = KernelEvent> = (
  event: TEvent
) => Promise<void> | void;

export type EventUnsubscribe = () => void;

export interface EventBus extends EventPublisher {
  subscribe<TEvent extends KernelEvent>(
    eventType: TEvent["type"],
    handler: EventHandler<TEvent>
  ): EventUnsubscribe;
}