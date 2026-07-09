import assert from "node:assert/strict";
import type { ZodSchema } from "zod";

import {
  BasicExecutiveReasoningProvider,
  FallbackExecutiveReasoningProvider,
  OpenAIExecutiveReasoningProvider,
} from "@/lib/executive";

import type {
  ExecutiveReasoningInput,
  ExecutiveReasoningProvider,
  ExecutiveReasoningResult,
} from "@/lib/executive";

import type { StructuredLanguageModel } from "@/lib/llm";

class FakeStructuredLanguageModel
  implements StructuredLanguageModel
{
  constructor(private readonly output: unknown) {}

  async generate<T>(
    _system: string,
    _prompt: string,
    schema: ZodSchema<T>
  ): Promise<T> {
    return schema.parse(this.output);
  }
}

class FailingExecutiveReasoningProvider
  implements ExecutiveReasoningProvider
{
  async reason(): Promise<ExecutiveReasoningResult> {
    throw new Error("Primary provider failed.");
  }
}

async function main(): Promise<void> {
  const input: ExecutiveReasoningInput = {
    input:
      "Jess is mad at me for not contacting insurance.",
    evidence: [
      {
        id: "evidence-obligation",
        label: "Unresolved obligation",
        summary:
          "The operator appears to have an unfinished obligation.",
        confidence: 0.84,
        source: "event-ai-provider-proof",
      },
      {
        id: "evidence-relationship",
        label: "Relationship impact",
        summary:
          "Another person may be affected by the unfinished obligation.",
        confidence: 0.78,
        source: "event-ai-provider-proof",
      },
    ],
  };

  const validModel = new FakeStructuredLanguageModel({
    priorities: [
      {
        title: "Resolve the insurance issue",
        rationale:
          "An unresolved obligation may be affecting another person.",
        suggestedNextStep:
          "Contact insurance and then update Jess.",
        evidenceIds: [
          "evidence-obligation",
          "evidence-relationship",
        ],
        confidence: 0.88,
      },
    ],
  });

  const openAIResult =
    await new OpenAIExecutiveReasoningProvider(
      validModel
    ).reason(input);

  assert.equal(
    openAIResult.provider,
    "openai",
    "Expected valid model output to preserve OpenAI provider provenance."
  );

  assert.equal(
    openAIResult.priorities.length,
    1,
    "Expected valid grounded model output to produce one priority."
  );

  assert.deepEqual(
    openAIResult.priorities[0].evidenceIds,
    [
      "evidence-obligation",
      "evidence-relationship",
    ],
    "Expected grounded evidence references to survive provider validation."
  );

  const inventedEvidenceModel =
    new FakeStructuredLanguageModel({
      priorities: [
        {
          title: "Invented priority",
          rationale:
            "This priority references evidence Forge did not supply.",
          suggestedNextStep:
            "Do something unsupported.",
          evidenceIds: ["invented-evidence-id"],
          confidence: 0.91,
        },
      ],
    });

  const inventedEvidenceResult =
    await new OpenAIExecutiveReasoningProvider(
      inventedEvidenceModel
    ).reason(input);

  assert.equal(
    inventedEvidenceResult.provider,
    "openai",
    "Expected provider provenance to remain OpenAI when invalid priorities are filtered."
  );

  assert.equal(
    inventedEvidenceResult.priorities.length,
    0,
    "Expected priorities with invented evidence references to be rejected."
  );

  const fallbackResult =
    await new FallbackExecutiveReasoningProvider(
      new FailingExecutiveReasoningProvider(),
      new BasicExecutiveReasoningProvider()
    ).reason(input);

  assert.equal(
    fallbackResult.provider,
    "basic",
    "Expected fallback provider provenance to remain explicit."
  );

  assert.equal(
    fallbackResult.priorities.length,
    2,
    "Expected deterministic fallback reasoning to remain usable."
  );

  console.log(
    "AI executive reasoning provider proof passed."
  );

  console.log(
    JSON.stringify(
      {
        validAIProvider:
          openAIResult.provider === "openai",
        groundedAIPriorities:
          openAIResult.priorities.length,
        inventedEvidenceRejected:
          inventedEvidenceResult.priorities.length === 0,
        fallbackProvider:
          fallbackResult.provider,
        fallbackPriorityCount:
          fallbackResult.priorities.length,
      },
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
