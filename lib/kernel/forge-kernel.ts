import type { Event, Question } from "@/lib/domain";

import { BasicEventIngestor, InMemoryEventStore } from "./event-store";
import type { EventIngestInput, EventIngestResult } from "./event-store";

import { InMemoryQuestionStore } from "./question-store";

import { BasicReasoningEngine } from "./reasoning";
import type { ReasoningResult } from "./reasoning";

import { BasicCuriosityEngine } from "./curiosity";

export class ForgeKernel {
  private readonly eventStore = new InMemoryEventStore();

  private readonly questionStore = new InMemoryQuestionStore();

  private readonly eventIngestor = new BasicEventIngestor(this.eventStore);

  private readonly reasoningEngine = new BasicReasoningEngine();

  private readonly curiosityEngine = new BasicCuriosityEngine();

  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    const result = await this.eventIngestor.ingest(input);

    const text = this.getTextFromPayload(input.payload);

    if (!text) {
      return result;
    }

    const reasoning = await this.reason(text);

    const curiosity = await this.curiosityEngine.generate({
      observations: reasoning.observations,
    });

    for (const question of curiosity.questions) {
      await this.questionStore.add(question);
    }

    const questions = await this.questionStore.list();

    return {
      ...result,
      questions,
    };
  }

  async reason(text: string): Promise<ReasoningResult> {
    return this.reasoningEngine.reason({ text });
  }

  async events(): Promise<Event[]> {
    return this.eventStore.list();
  }

  async questions(): Promise<Question[]> {
    return this.questionStore.list();
  }

  private getTextFromPayload(payload: unknown): string | null {
    if (
      typeof payload === "object" &&
      payload !== null &&
      "text" in payload &&
      typeof payload.text === "string"
    ) {
      return payload.text;
    }

    return null;
  }
}