import assert from "node:assert/strict";

import {
  BasicExecutiveSituationEngine,
  BasicExecutiveSituationProvider,
} from "@/lib/executive/situation";

async function main(): Promise<void> {
  const input = {
    sourceText:
      "Jess is mad at me for not contacting insurance. Maxx asked me to help with his project again.",
    evidence: [
      {
        id: "evidence-insurance",
        label: "Unresolved insurance issue",
        summary:
          "The operator appears to have an unfinished insurance responsibility.",
        confidence: 0.82,
        source: "event-executive-situation-proof",
      },
      {
        id: "evidence-maxx",
        label: "Request from Maxx",
        summary:
          "Maxx appears to be asking the operator for help with a project.",
        confidence: 0.76,
        source: "event-executive-situation-proof",
      },
    ],
  };

  const result =
    await new BasicExecutiveSituationEngine(
      new BasicExecutiveSituationProvider()
    ).interpret(input);

  assert.equal(
    result.situations.length,
    2,
    "Expected deterministic situation interpretation to preserve distinct evidence-backed situations."
  );

  assert.deepEqual(
    result.situations[0].evidenceIds,
    ["evidence-insurance"],
    "Expected situation candidates to preserve evidence references."
  );

  assert.deepEqual(
    result.situations[1].evidenceIds,
    ["evidence-maxx"],
    "Expected distinct situation candidates not to collapse unrelated evidence."
  );

  assert(
    result.situations.every(
      (situation) => situation.confidence >= 0 &&
        situation.confidence <= 1
    ),
    "Expected situation confidence values to remain bounded."
  );

  console.log("Executive situation proof passed.");
  console.log(
    JSON.stringify(
      {
        situationCount: result.situations.length,
        evidenceReferencesPreserved:
          result.situations.every(
            (situation) => situation.evidenceIds.length > 0
          ),
        distinctSituationsPreserved:
          result.situations[0].evidenceIds[0] !==
          result.situations[1].evidenceIds[0],
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
