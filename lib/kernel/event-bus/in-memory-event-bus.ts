import type {
  EventBus,
  EventHandler,
  EventUnsubscribe,
} from "@/lib/kernel/event-bus/event-bus";
import type { KernelEvent } from "@/lib/kernel/events/kernel-event";

export class InMemoryEventBus implements EventBus {
  private readonly handlersByType = new Map<string, Set<EventHandler>>();

  async publish(event: KernelEvent): Promise<void> {
    const handlers = this.handlersByType.get(event.type);

    if (!handlers || handlers.size === 0) {
      return;
    }

    await Promise.all(
      Array.from(handlers).map(async (handler) => {
        await handler(event);
      })
    );
  }

  subscribe<TEvent extends KernelEvent>(
    eventType: TEvent["type"],
    handler: EventHandler<TEvent>
  ): EventUnsubscribe {
    const existingHandlers = this.handlersByType.get(eventType);
    const handlers = existingHandlers ?? new Set<EventHandler>();

    handlers.add(handler as EventHandler);
    this.handlersByType.set(eventType, handlers);

    return () => {
      handlers.delete(handler as EventHandler);

      if (handlers.size === 0) {
        this.handlersByType.delete(eventType);
      }
    };
  }
}