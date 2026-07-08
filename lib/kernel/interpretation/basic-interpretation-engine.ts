// lib/kernel/interpretation/basic-interpretation-engine.ts
import type { Event } from "@/lib/domain";
import {
  SEMANTIC_EVENT_TYPES,
  type SemanticEvent,
  type SemanticEventType,
} from "@/lib/kernel/semantic-events";

import type {
  InterpretationRecord,
  SemanticSignal,
  SemanticSignalKind,
} from "./interpretation-record";
import type {
  InterpretationEngine,
  InterpretationEngineResult,
} from "./interpretation-engine";
import type { InterpretationRepository } from "./interpretation-repository";

type SignalDraft = {
  kind: SemanticSignalKind;
  label: string;
  summary: string;
  confidence: number;
  payload: Record<string, unknown>;
  eventType: SemanticEventType;
};

export class BasicInterpretationEngine implements InterpretationEngine {
  constructor(private readonly repository: InterpretationRepository) {}

  async interpret(event: Event): Promise<InterpretationEngineResult> {
    const text = this.getText(event.payload);
    const signalDrafts = text ? this.extractSignals(text) : [];
    const signals = signalDrafts.map((draft) => this.createSignal(draft));
    const semanticEvents = signalDrafts.map((draft, index) =>
      this.createSemanticEvent(event, draft, signals[index])
    );

    const record: InterpretationRecord = {
      id: crypto.randomUUID(),
      sourceEvent: event,
      interpretedAt: new Date(),
      signals,
      semanticEvents,
    };

    await this.repository.save(record);

    return {
      record,
      signals,
      semanticEvents,
    };
  }

  private extractSignals(text: string): SignalDraft[] {
    const normalized = text.toLowerCase();
    const drafts: SignalDraft[] = [];

    if (/\b(i promised|i promise|promised to|promise to)\b/.test(normalized)) {
      drafts.push({
        kind: "commitment",
        label: "Commitment",
        summary: "The input describes a promise or commitment.",
        confidence: 0.78,
        payload: { text },
        eventType: SEMANTIC_EVENT_TYPES.PROMISE_MADE,
      });
    }

    if (
      /\b(today|tomorrow|tonight|this week|next week|by \w+day)\b/.test(
        normalized
      )
    ) {
      drafts.push({
        kind: "temporal_reference",
        label: "Temporal reference",
        summary: "The input contains a time reference.",
        confidence: 0.72,
        payload: { text },
        eventType: SEMANTIC_EVENT_TYPES.TEMPORAL_REFERENCE_DETECTED,
      });
    }

    if (
      /\b(keep forgetting|forgot|forgetting|missed again|again)\b/.test(
        normalized
      )
    ) {
      drafts.push({
        kind: "repeated_failure_mode",
        label: "Repeated failure mode",
        summary: "The input suggests a recurring breakdown or repeated miss.",
        confidence: 0.7,
        payload: { text },
        eventType: SEMANTIC_EVENT_TYPES.REPEATED_FAILURE_MODE_DETECTED,
      });
    }

    if (
      /\b(mad|upset|angry|worried|concerned|stressed|anxious)\b/.test(
        normalized
      )
    ) {
      drafts.push({
        kind: "concern",
        label: "Concern",
        summary: "The input expresses concern about an outcome or reaction.",
        confidence: 0.68,
        payload: { text },
        eventType: SEMANTIC_EVENT_TYPES.CONCERN_DETECTED,
      });
    }

    if (
      /\b(going to be mad|will be mad|upset with me|mad at me)\b/.test(
        normalized
      )
    ) {
      drafts.push({
        kind: "relationship_impact",
        label: "Relationship impact",
        summary: "The input suggests the issue may affect a relationship.",
        confidence: 0.74,
        payload: { text },
        eventType: SEMANTIC_EVENT_TYPES.RELATIONSHIP_IMPACT_DETECTED,
      });
    }

    if (
      /\b(call|email|text|send|schedule|pay|submit|finish|complete)\b/.test(
        normalized
      )
    ) {
      drafts.push({
        kind: "unresolved_obligation",
        label: "Unresolved obligation",
        summary: "The input appears to describe an unfinished obligation.",
        confidence: 0.76,
        payload: { text },
        eventType: SEMANTIC_EVENT_TYPES.UNRESOLVED_OBLIGATION_DETECTED,
      });
    }

    return drafts;
  }

  private createSignal(draft: SignalDraft): SemanticSignal {
    return {
      id: crypto.randomUUID(),
      kind: draft.kind,
      label: draft.label,
      summary: draft.summary,
      confidence: draft.confidence,
      payload: draft.payload,
    };
  }

  private createSemanticEvent(
    sourceEvent: Event,
    draft: SignalDraft,
    signal: SemanticSignal
  ): SemanticEvent {
    return {
      id: crypto.randomUUID(),
      type: draft.eventType,
      occurredAt: new Date(),
      confidence: draft.confidence,
      source: {
        domainEventId: sourceEvent.id,
        sourceSystem: sourceEvent.source,
        sourceType: sourceEvent.type,
      },
      payload: {
        signalId: signal.id,
        signalKind: signal.kind,
        label: signal.label,
        summary: signal.summary,
        ...draft.payload,
      },
    };
  }

  private getText(payload: unknown): string | null {
    if (
      typeof payload === "object" &&
      payload !== null &&
      "text" in payload &&
      typeof payload.text === "string"
    ) {
      return payload.text;
    }

    if (
      typeof payload === "object" &&
      payload !== null &&
      "summary" in payload &&
      typeof payload.summary === "string"
    ) {
      return payload.summary;
    }

    return null;
  }
}