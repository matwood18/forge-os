import type { EventBus, EventBusSubscriber } from "@/lib/kernel/event-bus";
import type { ObservationRepository } from "@/lib/kernel/observation/observation-repository";
import {
  SEMANTIC_EVENT_TYPES,
  type SemanticEvent,
  type SemanticEventType,
} from "@/lib/kernel/semantic-events";

type ObservationSemanticPayload = {
  subjectEntityId: string;
  predicate: string;
  objectEntityId?: string | null;
  objectValue?: string | null;
  confidence?: number;
};

const OBSERVATION_EVENT_TYPES: SemanticEventType[] = [
  SEMANTIC_EVENT_TYPES.ATTRIBUTE_OBSERVED,
  SEMANTIC_EVENT_TYPES.LOCATION_OBSERVED,
  SEMANTIC_EVENT_TYPES.PREFERENCE_OBSERVED,
  SEMANTIC_EVENT_TYPES.PROMISE_MADE,
  SEMANTIC_EVENT_TYPES.DEADLINE_DETECTED,
];

export class SemanticObservationSubscriber implements EventBusSubscriber {
  constructor(private readonly observationRepository: ObservationRepository) {}

  register(eventBus: EventBus): void {
    for (const eventType of OBSERVATION_EVENT_TYPES) {
      eventBus.subscribe<SemanticEvent>(eventType, async (event) => {
        await this.handle(event);
      });
    }
  }

  private async handle(event: SemanticEvent): Promise<void> {
    if (!this.isObservationPayload(event.payload)) {
      return;
    }

    await this.observationRepository.remember({
      subjectEntityId: event.payload.subjectEntityId,
      predicate: event.payload.predicate,
      objectEntityId: event.payload.objectEntityId ?? null,
      objectValue: event.payload.objectValue ?? null,
      confidence: event.payload.confidence ?? event.confidence,
      sourceEventId: event.source?.domainEventId ?? event.id,
    });
  }

  private isObservationPayload(
    payload: Record<string, unknown>
  ): payload is ObservationSemanticPayload {
    return (
      typeof payload.subjectEntityId === "string" &&
      typeof payload.predicate === "string" &&
      this.isOptionalNullableString(payload.objectEntityId) &&
      this.isOptionalNullableString(payload.objectValue) &&
      this.isOptionalNumber(payload.confidence)
    );
  }

  private isOptionalNullableString(value: unknown): boolean {
    return (
      typeof value === "undefined" ||
      value === null ||
      typeof value === "string"
    );
  }

  private isOptionalNumber(value: unknown): boolean {
    return typeof value === "undefined" || typeof value === "number";
  }
}