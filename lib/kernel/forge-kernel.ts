import type { Event, Question } from "@/lib/domain";

import { BasicEventIngestor, InMemoryEventStore } from "./event-store";
import type { EventIngestInput, EventIngestResult } from "./event-store";

import { InMemoryQuestionStore } from "./question-store";

import { BasicReasoningEngine } from "./reasoning";
import type { ReasoningResult } from "./reasoning";

import { BasicCuriosityEngine } from "./curiosity";

import {
  BasicIdentityResolutionEngine,
  type IdentityResolutionEngineResult,
} from "./identity-resolution";

import { InMemoryPersonStore } from "./person-store";

export type CaptureResult = EventIngestResult;

export class ForgeKernel {
  private readonly eventStore = new InMemoryEventStore();

  private readonly questionStore = new InMemoryQuestionStore();

  private readonly personStore = new InMemoryPersonStore();

  private readonly eventIngestor = new BasicEventIngestor(this.eventStore);

  private readonly reasoningEngine = new BasicReasoningEngine();

  private readonly curiosityEngine = new BasicCuriosityEngine(this.personStore);

  private readonly identityResolutionEngine =
    new BasicIdentityResolutionEngine(this.personStore);

  async capture(text: string): Promise<CaptureResult> {
    return this.ingest({
      source: "manual",
      type: "manual.note",
      payload: {
        text,
      },
    });
  }

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

    const questions = await this.questionStore.listOpen();

    return {
      ...result,
      questions,
    };
  }

  async answerIdentityQuestion(
   question: Question,
   displayName: string
  ): Promise<IdentityResolutionEngineResult> {
    const result = await this.identityResolutionEngine.answer({
     question,
     displayName,
    });

    await this.questionStore.markAnswered(question.id);

    return result;
  }

  async reason(text: string): Promise<ReasoningResult> {
    return this.reasoningEngine.reason({ text });
  }

  async events(): Promise<Event[]> {
    return this.eventStore.list();
  }

  async questions(): Promise<Question[]> {
    return this.questionStore.listOpen();
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