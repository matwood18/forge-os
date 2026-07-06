import type { CognitiveEnvironment } from "./environment";
import type {
  CognitiveContext,
  CognitivePass,
  CognitivePipelineInput,
  CognitivePipelineResult,
} from "./types";

export class CognitivePipeline {
  constructor(
    private readonly passes: CognitivePass[],
    private readonly environment: CognitiveEnvironment
  ) {}

  async run(input: CognitivePipelineInput): Promise<CognitivePipelineResult> {
    const context: CognitiveContext = {
      input,
      artifacts: {
        observations: [],
        relationships: [],
        memories: [],
        questions: [],
      },
      metadata: {
        startedAt: new Date(),
      },
    };

    for (const pass of this.passes) {
      await pass.run(context, this.environment);
    }

    if (!context.artifacts.reasoningSession) {
      throw new Error("Cognitive pipeline completed without reasoning.");
    }

    return { context };
  }
}