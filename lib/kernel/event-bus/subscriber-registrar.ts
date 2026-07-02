import type { EventBus } from "@/lib/kernel/event-bus/event-bus";
import type { EventBusSubscriber } from "@/lib/kernel/event-bus/subscriber";

export class EventBusSubscriberRegistrar {
  constructor(private readonly eventBus: EventBus) {}

  register(subscriber: EventBusSubscriber): void {
    subscriber.register(this.eventBus);
  }

  registerMany(subscribers: EventBusSubscriber[]): void {
    for (const subscriber of subscribers) {
      this.register(subscriber);
    }
  }
}