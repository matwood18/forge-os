import { CognitivePipeline } from "./cognitive-pipeline";
import type { CognitiveEnvironment } from "./environment";
import { CuriosityPass } from "./passes/curiosity-pass";
import { MemoryPass } from "./passes/memory-pass";
import { ReasoningPass } from "./passes/reasoning-pass";
import { RelationshipPass } from "./passes/relationship-pass";

export type DefaultCognitivePipelineFactoryInput = {
  environment: CognitiveEnvironment;
};

export function createDefaultCognitivePipeline({
  environment,
}: DefaultCognitivePipelineFactoryInput): CognitivePipeline {
  return new CognitivePipeline(
    [
      new ReasoningPass(),
      new RelationshipPass(),
      new MemoryPass(),
      new CuriosityPass(),
    ],
    environment
  );
}