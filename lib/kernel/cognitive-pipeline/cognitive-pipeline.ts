// lib/kernel/cognitive-pipeline/cognitive-pipeline.ts
import type { CognitiveContextInitializer } from "./context-initializer";
import type { CognitiveEnvironment } from "./environment";
import type {
  CognitivePass,
  CognitivePipelineInput,
  CognitivePipelineResult,
} from "./types";

export class CognitivePipeline {
  constructor(
    private readonly passes: CognitivePass[],
    private readonly environment: CognitiveEnvironment,
    private readonly contextInitializer: CognitiveContextInitializer
  ) {}

  async run(input: CognitivePipelineInput): Promise<CognitivePipelineResult> {
    const context = await this.contextInitializer.initialize(input);

    for (const pass of this.passes) {
      await pass.run(context, this.environment);
    }

    if (!context.artifacts.reasoningSession) {
      throw new Error("Cognitive pipeline completed without reasoning.");
    }

    return { context };
  }
}