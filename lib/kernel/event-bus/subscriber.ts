import type { EventBus } from "@/lib/kernel/event-bus/event-bus";

export interface EventBusSubscriber {
  register(eventBus: EventBus): void;
}