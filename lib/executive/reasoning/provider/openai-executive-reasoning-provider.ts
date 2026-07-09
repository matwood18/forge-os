import { StructuredOpenAIModel } from "@/lib/infrastructure/ai/openai";
import type { StructuredLanguageModel } from "@/lib/llm";

import type { ExecutiveReasoningProvider } from "../executive-reasoning-provider";
import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningResult,
} from "../types";

import { EXECUTIVE_REASONING_SYSTEM_PROMPT } from "./openai-executive-reasoning-prompts";
import { OpenAIExecutiveReasoningResultSchema } from "./openai-executive-reasoning-schema";

export class OpenAIExecutiveReasoningProvider
  implements ExecutiveReasoningProvider
{
  constructor(
    private readonly model: StructuredLanguageModel =
      new StructuredOpenAIModel()
  ) {}

  async reason(
    input: ExecutiveReasoningInput
  ): Promise<ExecutiveReasoningResult> {
    const result = await this.model.generate(
      EXECUTIVE_REASONING_SYSTEM_PROMPT,
      JSON.stringify(
        {
          sourceText: input.input,
          evidence: input.evidence,
        },
        null,
        2
      ),
      OpenAIExecutiveReasoningResultSchema
    );

    const suppliedEvidenceIds = new Set(
      input.evidence.map((evidence) => evidence.id)
    );

    const priorities = result.priorities.filter(
      (priority) =>
        priority.evidenceIds.length > 0 &&
        priority.evidenceIds.every((evidenceId) =>
          suppliedEvidenceIds.has(evidenceId)
        )
    );

    return {
      priorities,
      generatedAt: new Date(),
      provider: "openai",
    };
  }
}
