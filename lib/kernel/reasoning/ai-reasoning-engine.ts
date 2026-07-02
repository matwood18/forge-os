import type { StructuredLanguageModel } from "@/lib/llm";
import { ObservationCandidateListSchema } from "./candidate-schema";
import { BasicObservationNormalizer } from "./basic-observation-normalizer";
import { REASONING_SYSTEM_PROMPT } from "./prompts";

import type { ReasoningEngine } from "./reasoning-engine";
import type { ReasoningInput, ReasoningResult } from "./types";

export class AIReasoningEngine implements ReasoningEngine {
  constructor(
    private readonly model: StructuredLanguageModel,
    private readonly normalizer = new BasicObservationNormalizer()
  ) {}

  async reason(
    input: ReasoningInput
  ): Promise<ReasoningResult> {
    const result = await this.model.generate(
      REASONING_SYSTEM_PROMPT,
      input.text,
      ObservationCandidateListSchema
    );

    return {
      observations: this.normalizer.normalize(
        result.observations
      ),
    };
  }
}