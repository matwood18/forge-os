import assert from "node:assert/strict";

import {
  BasicExecutiveSituationProvider,
  FallbackExecutiveSituationProvider,
} from "@/lib/executive/situation";

import type {
  ExecutiveSituationInput,
  ExecutiveSituationProvider,
  ExecutiveSituationResult,
} from "@/lib/executive/situation";

class SuccessfulSituationProvider
  implements ExecutiveSituationProvider
{
  public fallbackWasCalled = false;

  async interpret(): Promise<ExecutiveSituationResult> {
    return {
      situations: [
        {
          id: "primary-situation",
          title: "Primary situation",
          summary: "Primary provider succeeded.",
          evidenceIds: ["evidence-1"],
          confidence: 0.9,
        },
      ],
      generatedAt: new Date(),
    };
  }
}

class FailingSituationProvider
  implements ExecutiveSituationProvider
{
  async interpret(): Promise<ExecutiveSituationResult> {
    throw new Error("Primary situation provider failed.");
  }
}

class TrackingFallbackSituationProvider
  extends BasicExecutiveSituationProvider
{
  public wasCalled = false;

  async interpret(
    input: ExecutiveSituationInput
  ): Promise<ExecutiveSituationResult> {
    this.wasCalled = true;

    return super.interpret(input);
  }
}

async function main(): Promise<void> {
  const input: ExecutiveSituationInput = {
    sourceText:
      "Maxx asked me to help with his project again.",
    evidence: [
      {
        id: "evidence-1",
        label: "Request from Maxx",
        summary:
          "Maxx appears to be asking for help with a project.",
        confidence: 0.76,
      },
    ],
  };

  const fallbackForSuccess =
    new TrackingFallbackSituationProvider();

  const primarySuccess =
    await new FallbackExecutiveSituationProvider(
      new SuccessfulSituationProvider(),
      fallbackForSuccess
    ).interpret(input);

  assert.equal(
    primarySuccess.situations[0].id,
    "primary-situation",
    "Expected primary provider result to be returned when primary succeeds."
  );

  assert.equal(
    fallbackForSuccess.wasCalled,
    false,
    "Expected fallback provider not to be called when primary succeeds."
  );

  const fallbackForFailure =
    new TrackingFallbackSituationProvider();

  const fallbackResult =
    await new FallbackExecutiveSituationProvider(
      new FailingSituationProvider(),
      fallbackForFailure
    ).interpret(input);

  assert.equal(
    fallbackForFailure.wasCalled,
    true,
    "Expected fallback provider to be called when primary fails."
  );

  assert.equal(
    fallbackResult.situations.length,
    1,
    "Expected deterministic fallback situation output to remain usable."
  );

  assert.deepEqual(
    fallbackResult.situations[0].evidenceIds,
    ["evidence-1"],
    "Expected fallback situations to preserve evidence references."
  );

  console.log(
    "Executive situation fallback proof passed."
  );

  console.log(
    JSON.stringify(
      {
        primarySuccessReturned:
          primarySuccess.situations[0].id ===
          "primary-situation",
        fallbackSkippedOnSuccess:
          !fallbackForSuccess.wasCalled,
        fallbackCalledOnFailure:
          fallbackForFailure.wasCalled,
        fallbackSituationCount:
          fallbackResult.situations.length,
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
