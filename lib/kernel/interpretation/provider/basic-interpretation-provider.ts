import type { Event } from "@/lib/domain";

import type {
  InterpretationProvider,
  InterpretationProviderResult,
} from "./interpretation-provider";

import type {
  SemanticSignal,
  SemanticSignalKind,
} from "../interpretation-record";

type SignalDraft = {
  kind: SemanticSignalKind;
  label: string;
  summary: string;
  confidence: number;
  payload: Record<string, unknown>;
};

export class BasicInterpretationProvider implements InterpretationProvider {
  async interpret(event: Event): Promise<InterpretationProviderResult> {
    const text = this.getText(event.payload);

    const signals = text
      ? this.extractSignals(text).map((draft) => this.createSignal(draft))
      : [];

    return { signals };
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
      });
    }

    if (/\b(today|tomorrow|tonight|this week|next week|by \w+day)\b/.test(normalized)) {
      drafts.push({
        kind: "temporal_reference",
        label: "Temporal reference",
        summary: "The input contains a time reference.",
        confidence: 0.72,
        payload: { text },
      });
    }

    if (/\b(keep forgetting|forgot|forgetting|missed again|again)\b/.test(normalized)) {
      drafts.push({
        kind: "repeated_failure_mode",
        label: "Repeated failure mode",
        summary: "The input suggests a recurring breakdown or repeated miss.",
        confidence: 0.7,
        payload: { text },
      });
    }

    if (/\b(mad|upset|angry|worried|concerned|stressed|anxious)\b/.test(normalized)) {
      drafts.push({
        kind: "concern",
        label: "Concern",
        summary: "The input expresses concern about an outcome or reaction.",
        confidence: 0.68,
        payload: { text },
      });
    }

    if (/\b(going to be mad|will be mad|upset with me|mad at me)\b/.test(normalized)) {
      drafts.push({
        kind: "relationship_impact",
        label: "Relationship impact",
        summary: "The input suggests the issue may affect a relationship.",
        confidence: 0.74,
        payload: { text },
      });
    }

    if (/\b(call|email|text|send|schedule|pay|submit|finish|complete)\b/.test(normalized)) {
      drafts.push({
        kind: "unresolved_obligation",
        label: "Unresolved obligation",
        summary: "The input appears to describe an unfinished obligation.",
        confidence: 0.76,
        payload: { text },
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
