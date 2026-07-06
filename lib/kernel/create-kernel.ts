import {
  PrismaEntityRepository,
  PrismaObservationRepository,
} from "@/lib/infrastructure/prisma";

import { InMemoryEventBus } from "./event-bus";
import { ForgeKernel } from "./forge-kernel";
import {
  BasicArgumentSynthesizer,
  BasicReasoningEngine,
  InMemoryArgumentGeneratorRegistry,
  InMemoryReasoningSessionRepository,
  ObjectiveArgumentGenerator,
} from "./reasoning";

export function createKernel() {
  const argumentGeneratorRegistry = new InMemoryArgumentGeneratorRegistry();

  argumentGeneratorRegistry.register(new ObjectiveArgumentGenerator());

  const reasoningEngine = new BasicReasoningEngine(
    argumentGeneratorRegistry,
    new BasicArgumentSynthesizer(),
    new InMemoryReasoningSessionRepository()
  );

  return new ForgeKernel({
    eventBus: new InMemoryEventBus(),
    eventBusSubscribers: [],
    reasoningEngine,
    entityRepository: new PrismaEntityRepository(),
    observationRepository: new PrismaObservationRepository(),
  });
}