import assert from "node:assert/strict";
import type { ZodSchema } from "zod";

import {
  OpenAIExecutiveSituationProvider,
} from "@/lib/executive/situation";

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

async function main(): Promise<void> {
  const input = {
    sourceText:
      "Jess is mad at me for not contacting insurance. I need to call the dentist before Friday. Maxx asked me to help with his project again.",
    evidence: [
      {
        id: "evidence-insurance",
        label: "Unresolved insurance issue",
        summary:
          "The operator appears to have an unfinished insurance responsibility.",
        confidence: 0.82,
      },
      {
        id: "evidence-relationship",
        label: "Relationship impact",
        summary:
          "The insurance issue may be affecting Jess.",
        confidence: 0.78,
      },
      {
        id: "evidence-dentist",
        label: "Dentist deadline",
        summary:
          "The operator needs to call the dentist before Friday.",
        confidence: 0.84,
      },
      {
        id: "evidence-maxx",
        label: "Request from Maxx",
        summary:
          "Maxx appears to be asking the operator for help with a project.",
        confidence: 0.76,
      },
    ],
  };

  const validModel = new FakeStructuredLanguageModel({
    situations: [
      {
        title: "Insurance issue affecting Jess",
        summary:
          "An unfinished insurance responsibility may be contributing to tension with Jess.",
        evidenceIds: [
          "evidence-insurance",
          "evidence-relationship",
        ],
        confidence: 0.88,
      },
      {
        title: "Dentist call before Friday",
        summary:
          "A separate time-sensitive dentist call needs attention before Friday.",
        evidenceIds: ["evidence-dentist"],
        confidence: 0.86,
      },
      {
        title: "Maxx needs help with a project",
        summary:
          "Maxx has made a separate request for help with his project.",
        evidenceIds: ["evidence-maxx"],
        confidence: 0.8,
      },
    ],
  });

  const validResult =
    await new OpenAIExecutiveSituationProvider(
      validModel
    ).interpret(input);

  assert.equal(
    validResult.situations.length,
    3,
    "Expected valid model output to preserve three distinct situations."
  );

  assert.deepEqual(
    validResult.situations[0].evidenceIds,
    [
      "evidence-insurance",
      "evidence-relationship",
    ],
    "Expected related evidence to remain grouped in one situation."
  );

  assert.deepEqual(
    validResult.situations[2].evidenceIds,
    ["evidence-maxx"],
    "Expected the Maxx request to remain distinct."
  );

  assert(
    validResult.situations.every(
      (situation) =>
        situation.id.startsWith("openai-situation:")
    ),
    "Expected provider-created situation IDs."
  );

  const inventedEvidenceModel =
    new FakeStructuredLanguageModel({
      situations: [
        {
          title: "Unsupported situation",
          summary:
            "This situation references evidence Forge did not supply.",
          evidenceIds: ["invented-evidence-id"],
          confidence: 0.94,
        },
      ],
    });

  const inventedEvidenceResult =
    await new OpenAIExecutiveSituationProvider(
      inventedEvidenceModel
    ).interpret(input);

  assert.equal(
    inventedEvidenceResult.situations.length,
    0,
    "Expected situations with invented evidence references to be rejected."
  );

  console.log(
    "AI executive situation provider proof passed."
  );

  console.log(
    JSON.stringify(
      {
        distinctSituationCount:
          validResult.situations.length,
        relatedEvidenceGrouped:
          validResult.situations[0].evidenceIds.length === 2,
        maxxSituationPreserved:
          validResult.situations[2].evidenceIds[0] ===
          "evidence-maxx",
        inventedEvidenceRejected:
          inventedEvidenceResult.situations.length === 0,
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
