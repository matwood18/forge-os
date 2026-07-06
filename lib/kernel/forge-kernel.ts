import type { Event, Question } from "@/lib/domain";

import { BasicCuriosityEngine } from "./curiosity";
import type { CuriosityEngine } from "./curiosity";

import { EntityService } from "./entity";

import {
  EventBusSubscriberRegistrar,
  InMemoryEventBus,
  type EventBus,
  type EventBusSubscriber,
} from "./event-bus";

import { BasicEventIngestor, InMemoryEventStore } from "./event-store";
import type { EventIngestInput, EventIngestResult } from "./event-store";

import {
  BasicIdentityResolutionEngine,
  type IdentityResolutionEngineResult,
} from "./identity-resolution";

import {
  InMemoryMemoryRepository,
  MemoryEngine,
  MemoryService,
  RelationshipMemoryProducer,
} from "./memory";

import type { MemoryRecord } from "./memory";

import type { ObservationRepository } from "./observation/observation-repository";

import { InMemoryPersonStore } from "./person-store";

import { InMemoryQuestionStore } from "./question-store";

import { BasicReasoningEngine, type ReasoningEngine } from "./reasoning";
import type { ReasoningResult } from "./reasoning";

import type { EntityRepository } from "./repositories";

import {
  BasicRelationshipEngine,
  createDefaultRelationshipRules,
  InMemoryRelationshipRepository,
  type RelationshipEngine,
  type RelationshipRecord,
  type RelationshipRepository,
} from "./relationship";

export type CaptureResult = EventIngestResult;

export type ForgeKernelDependencies = {
  reasoningEngine?: ReasoningEngine;
  observationRepository?: ObservationRepository;
  entityRepository?: EntityRepository;
  relationshipEngine?: RelationshipEngine;
  relationshipRepository?: RelationshipRepository;
  eventBus?: EventBus;
  eventBusSubscribers?: EventBusSubscriber[];
};

export class ForgeKernel {
  private readonly eventBus: EventBus;
  private readonly eventBusSubscriberRegistrar: EventBusSubscriberRegistrar;

  private readonly eventStore = new InMemoryEventStore();
  private readonly questionStore = new InMemoryQuestionStore();
  private readonly personStore = new InMemoryPersonStore();

  private readonly eventIngestor = new BasicEventIngestor(this.eventStore);

  private readonly reasoningEngine: ReasoningEngine;
  private readonly memory: MemoryService;
  private readonly entityService: EntityService;
  private readonly curiosityEngine: CuriosityEngine;

  private readonly observationRepository?: ObservationRepository;

  private readonly relationshipRepository: RelationshipRepository;
  private readonly relationshipEngine: RelationshipEngine;
  private readonly relationshipMemoryProducer = new RelationshipMemoryProducer();

  private readonly identityResolutionEngine =
    new BasicIdentityResolutionEngine(this.personStore);

  constructor(dependencies: ForgeKernelDependencies = {}) {
    this.eventBus = dependencies.eventBus ?? new InMemoryEventBus();

    this.eventBusSubscriberRegistrar = new EventBusSubscriberRegistrar(
      this.eventBus
    );

    this.eventBusSubscriberRegistrar.registerMany(
      dependencies.eventBusSubscribers ?? []
    );

    this.reasoningEngine =
      dependencies.reasoningEngine ?? new BasicReasoningEngine();

    this.observationRepository = dependencies.observationRepository;

    this.entityService = new EntityService(dependencies.entityRepository);

    const memoryRepository = new InMemoryMemoryRepository();
    const memoryEngine = new MemoryEngine(memoryRepository);

    this.memory = new MemoryService(memoryEngine);

    this.curiosityEngine = new BasicCuriosityEngine(
      this.personStore,
      dependencies.entityRepository
    );

    this.relationshipRepository =
      dependencies.relationshipRepository ??
      new InMemoryRelationshipRepository();

    this.relationshipEngine =
      dependencies.relationshipEngine ??
      new BasicRelationshipEngine(
        this.relationshipRepository,
        createDefaultRelationshipRules()
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
    return this.entityService.all();
  }

  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    const result = await this.eventIngestor.ingest(input);
    const text = this.getTextFromPayload(input.payload);

    if (!text) {
      return result;
    }

    const reasoning = await this.reason(text);

    await this.inferRelationshipsFromObservations();

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

  async publish(event: Parameters<EventBus["publish"]>[0]): Promise<void> {
    await this.eventBus.publish(event);
  }

  eventSystem(): EventBus {
    return this.eventBus;
  }

  async answerIdentityQuestion(
    question: Question,
    displayName: string
  ): Promise<IdentityResolutionEngineResult> {
    const result = await this.identityResolutionEngine.answer({
      question,
      displayName,
    });

    await this.entityService.remember({
      type: "PERSON",
      displayName: result.displayName,
    });

    await this.inferRelationshipsFromObservations();

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

  async relationships(): Promise<RelationshipRecord[]> {
    return this.relationshipRepository.all();
  }

  async memories(): Promise<MemoryRecord[]> {
    return this.memory.all();
  }

  private async inferRelationshipsFromObservations(): Promise<void> {
    if (!this.observationRepository) {
      return;
    }

    const observations = await this.observationRepository.all();
    const relationships =
      await this.relationshipEngine.inferRelationships(observations);

    const memoryAssertions =
      this.relationshipMemoryProducer.produce(relationships);

    for (const assertion of memoryAssertions) {
      await this.memory.rememberAssertion(assertion);
    }
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