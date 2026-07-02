import type { KernelEvent } from "@/lib/kernel/events/kernel-event";

export type DomainEventType =
  | "interaction.logged"
  | "task.created"
  | "task.completed"
  | "status.changed";

export interface DomainEvent<TPayload = unknown> extends KernelEvent {
  type: DomainEventType;
  payload: TPayload;
}

export interface InteractionLoggedPayload {
  subjectEntityId: string;
  summary: string;
  confidence?: number;
}

export type InteractionLoggedEvent = DomainEvent<InteractionLoggedPayload> & {
  type: "interaction.logged";
};

export function createInteractionLoggedEvent(
  payload: InteractionLoggedPayload
): InteractionLoggedEvent {
  return {
    id: crypto.randomUUID(),
    type: "interaction.logged",
    payload,
    occurredAt: new Date(),
  };
}