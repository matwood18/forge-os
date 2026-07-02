import type { KernelEvent } from "@/lib/kernel/events/kernel-event";
import type { SemanticEventType } from "@/lib/kernel/semantic-events/semantic-event-types";

export type SemanticEventSource = {
  domainEventId?: string;
  sourceSystem?: string;
  sourceType?: string;
};

export interface SemanticEvent<TPayload = Record<string, unknown>>
  extends KernelEvent {
  type: SemanticEventType;
  confidence: number;
  source?: SemanticEventSource;
  payload: TPayload;
}