import { StructuredOpenAIModel } from "@/lib/infrastructure/ai/openai";
import type { StructuredLanguageModel } from "@/lib/llm";

import type { ExecutiveSituationProvider } from "../executive-situation-provider";
import type {
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "../types";

import { EXECUTIVE_SITUATION_SYSTEM_PROMPT } from "./openai-executive-situation-prompts";
import { OpenAIExecutiveSituationResultSchema } from "./openai-executive-situation-schema";

export class OpenAIExecutiveSituationProvider
  implements ExecutiveSituationProvider
{
  constructor(
    private readonly model: StructuredLanguageModel =
      new StructuredOpenAIModel()
  ) {}

  async interpret(
    input: ExecutiveSituationInput
  ): Promise<ExecutiveSituationResult> {
    const result = await this.model.generate(
      EXECUTIVE_SITUATION_SYSTEM_PROMPT,
      JSON.stringify(
        {
          sourceText: input.sourceText,
          evidence: input.evidence,
        },
        null,
        2
      ),
      OpenAIExecutiveSituationResultSchema
    );

    const suppliedEvidenceIds = new Set(
      input.evidence.map((evidence) => evidence.id)
    );

    const situations = result.situations
      .filter(
        (situation) =>
          situation.evidenceIds.length > 0 &&
          situation.evidenceIds.every((evidenceId) =>
            suppliedEvidenceIds.has(evidenceId)
          )
      )
      .map((situation, index) => ({
        id: `openai-situation:${index + 1}`,
        ...situation,
      }));

    return {
      situations,
      generatedAt: new Date(),
    };
  }
}
