// lib/kernel/forge-kernel.ts
import type { Event, Question } from "@/lib/domain";

import {
  BasicActionMaterializationEngine,
  InMemoryActionRepository,
  type ActionMaterializationEngine,
  type ActionRecord,
  type ActionRepository,
} from "./action";

import {
  BasicAuthorizationEngine,
  InMemoryAuthorizationRepository,
  type AuthorizationDecision,
  type AuthorizationEngine,
  type AuthorizationRepository,
} from "./authorization";

import { CognitivePipeline } from "./cognitive-pipeline/cognitive-pipeline";
import {
  createDefaultCognitivePipeline,
  DefaultCognitiveContextInitializer,
  type CognitivePassExecution,
  type CognitivePipelineInput,
} from "./cognitive-pipeline";

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

import { KernelExecutionRecorder, type KernelExecution } from "./execution";

import {
  BasicGoalEngine,
  InMemoryGoalRepository,
  type GoalEngine,
} from "./goal";

import {
  BasicGroundingEngine,
  InMemoryGroundingRepository,
  type GroundingEngine,
  type GroundingRepository,
} from "./grounding";

import {
  BasicIdentityResolutionEngine,
  type IdentityResolutionEngineResult,
} from "./identity-resolution";

import {
  BasicInterpretationEngine,
  BasicSemanticObservationProjector,
  InMemoryInterpretationRepository,
  type InterpretationEngine,
  type InterpretationRecord,
  type InterpretationRepository,
  type SemanticObservationProjector,
} from "./interpretation";

import {
  InMemoryMemoryRepository,
  MemoryEngine,
  MemoryService,
  RelationshipMemoryProducer,
} from "./memory";

import type { MemoryRecord } from "./memory";

import {
  InMemoryObservationRepository,
  type ObservationRecord,
  type ObservationRepository,
} from "./observation";

import { InMemoryPersonStore } from "./person-store";

import {
  BasicPlanningEngine,
  InMemoryPlanRepository,
  type PlanningEngine,
} from "./planning";

import { InMemoryQuestionStore } from "./question-store";

import {
  BasicRecommendationEngine,
  InMemoryRecommendationRepository,
  type RecommendationEngine,
  type RecommendationRecord,
  type RecommendationRepository,
} from "./recommendation";

import {
  BasicReflectionEngine,
  InMemoryReflectionRepository,
  type ReflectionEngine,
  type ReflectionRecord,
  type ReflectionRepository,
} from "./reflection";

import {
  BasicArgumentSynthesizer,
  BasicReasoningEngine,
  InMemoryArgumentGeneratorRegistry,
  InMemoryReasoningSessionRepository,
  ObjectiveArgumentGenerator,
  type ReasoningEngine,
  type ReasoningSession,
} from "./reasoning";

import type { EntityRepository } from "./repositories";

import {
  BasicRelationshipEngine,
  createDefaultRelationshipRules,
  InMemoryRelationshipRepository,
  type RelationshipEngine,
  type RelationshipRecord,
  type RelationshipRepository,
} from "./relationship";

import { BasicWorldModelBuilder } from "./world-model";

export type CaptureResult = EventIngestResult;

export type ForgeKernelDependencies = {
  reasoningEngine?: ReasoningEngine;
  observationRepository?: ObservationRepository;
  entityRepository?: EntityRepository;
  relationshipEngine?: RelationshipEngine;
  relationshipRepository?: RelationshipRepository;
  goalEngine?: GoalEngine;
  planningEngine?: PlanningEngine;
  interpretationEngine?: InterpretationEngine;
  interpretationRepository?: InterpretationRepository;
  groundingEngine?: GroundingEngine;
  groundingRepository?: GroundingRepository;
  semanticObservationProjector?: SemanticObservationProjector;
  reflectionEngine?: ReflectionEngine;
  reflectionRepository?: ReflectionRepository;
  recommendationEngine?: RecommendationEngine;
  recommendationRepository?: RecommendationRepository;
  authorizationEngine?: AuthorizationEngine;
  authorizationRepository?: AuthorizationRepository;
  actionMaterializationEngine?: ActionMaterializationEngine;
  actionRepository?: ActionRepository;
  eventBus?: EventBus;
  eventBusSubscribers?: EventBusSubscriber[];
};

type CognitiveRunResult = {
  reasoningSession: ReasoningSession;
  observations: ObservationRecord[];
  relationships: RelationshipRecord[];
  memories: MemoryRecord[];
  questions: Question[];
  passExecutions: CognitivePassExecution[];
};

export class ForgeKernel {
  private readonly eventBus: EventBus;
  private readonly eventBusSubscriberRegistrar: EventBusSubscriberRegistrar;

  private readonly eventStore = new InMemoryEventStore();
  private readonly questionStore = new InMemoryQuestionStore();
  private readonly personStore = new InMemoryPersonStore();

  private readonly eventIngestor = new BasicEventIngestor(this.eventStore);

  private readonly reasoningEngine: ReasoningEngine;
  private readonly cognitivePipeline: CognitivePipeline;
  private readonly memory: MemoryService;
  private readonly entityService: EntityService;
  private readonly curiosityEngine: CuriosityEngine;
  private readonly goalEngine: GoalEngine;
  private readonly planningEngine: PlanningEngine;
  private readonly interpretationEngine: InterpretationEngine;
  private readonly interpretationRepository: InterpretationRepository;
  private readonly groundingEngine: GroundingEngine;
  private readonly groundingRepository: GroundingRepository;
  private readonly semanticObservationProjector: SemanticObservationProjector;
  private readonly reflectionEngine: ReflectionEngine;
  private readonly reflectionRepository: ReflectionRepository;
  private readonly recommendationEngine: RecommendationEngine;
  private readonly recommendationRepository: RecommendationRepository;
  private readonly authorizationEngine: AuthorizationEngine;
  private readonly authorizationRepository: AuthorizationRepository;
  private readonly actionMaterializationEngine: ActionMaterializationEngine;
  private readonly actionRepository: ActionRepository;

  private readonly observationRepository: ObservationRepository;

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
      dependencies.reasoningEngine ?? this.createDefaultReasoningEngine();

    this.observationRepository =
      dependencies.observationRepository ?? new InMemoryObservationRepository();

    this.entityService = new EntityService(dependencies.entityRepository);

    const memoryRepository = new InMemoryMemoryRepository();
    const memoryEngine = new MemoryEngine(memoryRepository);

    this.memory = new MemoryService(memoryEngine);

    this.curiosityEngine = new BasicCuriosityEngine(
      this.personStore,
      dependencies.entityRepository
    );

    this.relationshipRepository =
      dependencies.relationshipRepository ?? new InMemoryRelationshipRepository();

    this.relationshipEngine =
      dependencies.relationshipEngine ??
      new BasicRelationshipEngine(
        this.relationshipRepository,
        createDefaultRelationshipRules()
      );

    this.goalEngine =
      dependencies.goalEngine ?? new BasicGoalEngine(new InMemoryGoalRepository());

    this.planningEngine =
      dependencies.planningEngine ??
      new BasicPlanningEngine(new InMemoryPlanRepository());

    this.interpretationRepository =
      dependencies.interpretationRepository ??
      new InMemoryInterpretationRepository();

    this.interpretationEngine =
      dependencies.interpretationEngine ??
      new BasicInterpretationEngine(this.interpretationRepository);

    this.groundingRepository =
      dependencies.groundingRepository ?? new InMemoryGroundingRepository();

    this.groundingEngine =
      dependencies.groundingEngine ??
      new BasicGroundingEngine(this.groundingRepository);

    this.semanticObservationProjector =
      dependencies.semanticObservationProjector ??
      new BasicSemanticObservationProjector(this.observationRepository);

    this.reflectionRepository =
      dependencies.reflectionRepository ?? new InMemoryReflectionRepository();

    this.reflectionEngine =
      dependencies.reflectionEngine ??
      new BasicReflectionEngine(this.reflectionRepository);

    this.recommendationRepository =
      dependencies.recommendationRepository ??
      new InMemoryRecommendationRepository();

    this.recommendationEngine =
      dependencies.recommendationEngine ??
      new BasicRecommendationEngine(this.recommendationRepository);

    this.authorizationRepository =
      dependencies.authorizationRepository ??
      new InMemoryAuthorizationRepository();

    this.authorizationEngine =
      dependencies.authorizationEngine ??
      new BasicAuthorizationEngine(this.authorizationRepository);

    this.actionRepository =
      dependencies.actionRepository ?? new InMemoryActionRepository();

    this.actionMaterializationEngine =
      dependencies.actionMaterializationEngine ??
      new BasicActionMaterializationEngine(this.actionRepository);

    const worldModelBuilder = new BasicWorldModelBuilder({
      observationRepository: this.observationRepository,
      relationshipRepository: this.relationshipRepository,
      memoryRepository,
      questionStore: this.questionStore,
    });

    const contextInitializer = new DefaultCognitiveContextInitializer({
      worldModelBuilder,
    });

    this.cognitivePipeline = createDefaultCognitivePipeline({
      environment: {
        reasoningEngine: this.reasoningEngine,
        relationshipEngine: this.relationshipEngine,
        memoryService: this.memory,
        relationshipMemoryProducer: this.relationshipMemoryProducer,
        curiosityEngine: this.curiosityEngine,
        questionStore: this.questionStore,
        goalEngine: this.goalEngine,
        planningEngine: this.planningEngine,
        observationRepository: this.observationRepository,
      },
      contextInitializer,
    });
  }

  async capture(text: string): Promise<CaptureResult> {
    return this.ingest({
      source: "manual",
      type: "manual.note",
      payload: { text },
    });
  }

  async execute(text: string): Promise<KernelExecution> {
    const recorder = new KernelExecutionRecorder();

    recorder.recordInput(text);

    const ingestResult = await this.eventIngestor.ingest({
      source: "manual",
      type: "manual.note",
      payload: { text },
    });

    recorder.recordEvent(ingestResult.event);

    const interpretationResult = await this.interpretationEngine.interpret(
      ingestResult.event
    );

    recorder.recordInterpretation(interpretationResult.record);

    const groundingResult = await this.groundingEngine.ground({
      interpretation: interpretationResult.record,
    });

    recorder.recordGrounding(groundingResult.record);

    const projectedObservationResult =
      await this.semanticObservationProjector.project({
        interpretation: interpretationResult.record,
      });

    const cognitiveRun = await this.runCognition({
      text,
      interpretation: interpretationResult.record,
    });

    recorder.recordPassExecutions(cognitiveRun.passExecutions);

    for (const observation of projectedObservationResult.observations) {
      recorder.recordObservation(observation);
    }

    for (const observation of cognitiveRun.observations) {
      recorder.recordObservation(observation);
    }

    for (const relationship of cognitiveRun.relationships) {
      recorder.recordRelationship(relationship);
    }

    for (const memory of cognitiveRun.memories) {
      recorder.recordMemory(memory);
    }

    recorder.recordReasoning(cognitiveRun.reasoningSession);

    for (const question of cognitiveRun.questions) {
      recorder.recordQuestion(question);
    }

    const execution = recorder.complete(text);

    const reflectionResult = await this.reflectionEngine.reflect({
      execution,
    });

    const recommendationResult = await this.recommendationEngine.recommend({
      executionId: execution.id,
      reflections: reflectionResult.reflections,
    });

    const authorizationResult = await this.authorizationEngine.evaluate({
      executionId: execution.id,
      recommendations: recommendationResult.recommendations,
    });

    await this.actionMaterializationEngine.materialize({
      executionId: execution.id,
      recommendations: recommendationResult.recommendations,
      authorizationDecisions: authorizationResult.decisions,
    });

    return execution;
  }

  async people() {
    return this.entityService.all();
  }

  async ingest(input: EventIngestInput): Promise<EventIngestResult> {
    const result = await this.eventIngestor.ingest(input);
    const text = this.getTextFromPayload(input.payload);

    const interpretationResult = await this.interpretationEngine.interpret(
      result.event
    );

    await this.groundingEngine.ground({
      interpretation: interpretationResult.record,
    });

    await this.semanticObservationProjector.project({
      interpretation: interpretationResult.record,
    });

    if (!text) {
      return result;
    }

    const cognitiveRun = await this.runCognition({
      text,
      interpretation: interpretationResult.record,
    });

    return {
      ...result,
      questions: cognitiveRun.questions,
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

    await this.cognitivePipeline.run({ text: question.prompt });

    await this.questionStore.markAnswered(question.id);

    return result;
  }

  async reason(text: string): Promise<ReasoningSession> {
    const result = await this.cognitivePipeline.run({ text });
    const reasoningSession = result.context.artifacts.reasoningSession;

    if (!reasoningSession) {
      throw new Error("Cognitive pipeline completed without reasoning.");
    }

    return reasoningSession;
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

  async interpretations(): Promise<InterpretationRecord[]> {
    return this.interpretationRepository.all();
  }

  async reflections(): Promise<ReflectionRecord[]> {
    return this.reflectionRepository.all();
  }

  async recommendations(): Promise<RecommendationRecord[]> {
    return this.recommendationRepository.all();
  }

  async authorizationDecisions(): Promise<AuthorizationDecision[]> {
    return this.authorizationRepository.all();
  }

  async actions(): Promise<ActionRecord[]> {
    return this.actionRepository.all();
  }

  private createDefaultReasoningEngine(): ReasoningEngine {
    const argumentGeneratorRegistry = new InMemoryArgumentGeneratorRegistry();

    argumentGeneratorRegistry.register(new ObjectiveArgumentGenerator());

    return new BasicReasoningEngine(
      argumentGeneratorRegistry,
      new BasicArgumentSynthesizer(),
      new InMemoryReasoningSessionRepository()
    );
  }

  private async runCognition(
    input: CognitivePipelineInput
  ): Promise<CognitiveRunResult> {
    const pipelineResult = await this.cognitivePipeline.run(input);
    const { artifacts, metadata } = pipelineResult.context;
    const reasoningSession = artifacts.reasoningSession;

    if (!reasoningSession) {
      throw new Error("Cognitive pipeline completed without reasoning.");
    }

    return {
      reasoningSession,
      observations: artifacts.observations,
      relationships: artifacts.relationships,
      memories: artifacts.memories,
      questions: artifacts.questions,
      passExecutions: metadata.passExecutions,
    };
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