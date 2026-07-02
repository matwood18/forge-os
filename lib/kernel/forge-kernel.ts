import type { Event, Question } from "@/lib/domain";

import { BasicEventIngestor, InMemoryEventStore } from "./event-store";
import type { EventIngestInput, EventIngestResult } from "./event-store";

import { InMemoryQuestionStore } from "./question-store";

import { BasicReasoningEngine, type ReasoningEngine } from "./reasoning";
import type { ReasoningResult } from "./reasoning";

import { BasicCuriosityEngine } from "./curiosity";
import type { CuriosityEngine } from "./curiosity";

import {
  BasicIdentityResolutionEngine,
  type IdentityResolutionEngineResult,
} from "./identity-resolution";

import { MemoryService } from "./memory";
import { InMemoryPersonStore } from "./person-store";
import type { EntityRepository } from "./repositories";

import type { ObservationRepository } from "./observation/observation-repository";

export type CaptureResult = EventIngestResult;

export type ForgeKernelDependencies = {
  reasoningEngine?: ReasoningEngine;
  observationRepository?: ObservationRepository;
  entityRepository?: EntityRepository;
};

export class ForgeKernel {
  private readonly eventStore = new InMemoryEventStore();
  private readonly questionStore = new InMemoryQuestionStore();
  private readonly personStore = new InMemoryPersonStore();

  private readonly eventIngestor = new BasicEventIngestor(this.eventStore);
  private readonly reasoningEngine: ReasoningEngine;
  private readonly memory: MemoryService;
  private readonly curiosityEngine: CuriosityEngine;

  private readonly identityResolutionEngine =
    new BasicIdentityResolutionEngine(this.personStore);

  constructor(dependencies: ForgeKernelDependencies = {}) {
    this.reasoningEngine =
      dependencies.reasoningEngine ?? new BasicReasoningEngine();

    this.memory = new MemoryService(
      dependencies.entityRepository,
      dependencies.observationRepository
    );

    this.curiosityEngine = new BasicCuriosityEngine(
      this.personStore,
      dependencies.entityRepository
    );
  }

  async capture(text: string): Promise<CaptureResult> {
    return this.ingest({
      source: "manual",
      type: "manual.note",
      payload: { text },
    });
  }

  async people() {
    return this.memory.entities();
  }

  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    const result = await this.eventIngestor.ingest(input);
    const text = this.getTextFromPayload(input.payload);

    if (!text) return result;

    const reasoning = await this.reason(text);

    const curiosity = await this.curiosityEngine.generate({
      observations: reasoning.observations,
    });

    for (const question of curiosity.questions) {
      await this.questionStore.add(question);
    }

    return {
      ...result,
      questions: await this.questionStore.listOpen(),
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

    await this.memory.learnEntity({
      type: "PERSON",
      displayName: result.displayName,
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