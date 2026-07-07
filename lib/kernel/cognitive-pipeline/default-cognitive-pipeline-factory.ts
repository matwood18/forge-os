// lib/kernel/cognitive-pipeline/default-cognitive-pipeline-factory.ts
import type { CognitiveContextInitializer } from "./context-initializer";
import { CognitivePipeline } from "./cognitive-pipeline";
import type { CognitiveEnvironment } from "./environment";
import { CuriosityPass } from "./passes/curiosity-pass";
import { MemoryPass } from "./passes/memory-pass";
import { PlanningPass } from "./passes/planning-pass";
import { ReasoningPass } from "./passes/reasoning-pass";
import { RelationshipPass } from "./passes/relationship-pass";

export type DefaultCognitivePipelineFactoryInput = {
  environment: CognitiveEnvironment;
  contextInitializer: CognitiveContextInitializer;
};

export function createDefaultCognitivePipeline({
  environment,
  contextInitializer,
}: DefaultCognitivePipelineFactoryInput): CognitivePipeline {
  return new CognitivePipeline(
    [
      new ReasoningPass(),
      new RelationshipPass(),
      new MemoryPass(),
      new CuriosityPass(),
      new PlanningPass(),
    ],
    environment,
    contextInitializer
  );
}