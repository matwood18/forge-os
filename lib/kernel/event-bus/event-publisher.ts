import type { KernelEvent } from "@/lib/kernel/events/kernel-event";

export interface EventPublisher {
  publish(event: KernelEvent): Promise<void>;
}