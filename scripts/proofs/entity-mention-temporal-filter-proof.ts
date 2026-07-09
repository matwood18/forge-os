import assert from "node:assert/strict";

import { BasicEntityMentionExtractor } from "@/lib/kernel/entity-mention";
import type { InterpretationRecord } from "@/lib/kernel/interpretation";

async function main(): Promise<void> {
  const interpretation: InterpretationRecord = {
    id: "interpretation-temporal-filter-proof",
    sourceEvent: {
      id: "event-temporal-filter-proof",
      type: "manual_note.created",
      source: "proof",
      occurredAt: new Date("2026-07-09T12:00:00.000Z"),
      payload: {
        text: "Jess is mad. I need to call the dentist before Friday. Maxx asked me again.",
      },
    },
    interpretedAt: new Date("2026-07-09T12:00:00.000Z"),
    signals: [],
    semanticEvents: [],
  };

  const result = await new BasicEntityMentionExtractor().extract({
    interpretation,
  });

  const personNames = result.record.mentions.filter(
    (mention) => mention.kind === "person_name"
  );

  assert(
    personNames.some((mention) => mention.normalizedText === "jess"),
    "Expected Jess to remain a person mention."
  );

  assert(
    personNames.some((mention) => mention.normalizedText === "maxx"),
    "Expected Maxx to remain a person mention."
  );

  assert(
    !personNames.some((mention) => mention.normalizedText === "friday"),
    "Expected Friday not to be classified as a person mention."
  );

  console.log("Entity mention temporal filter proof passed.");
  console.log(
    JSON.stringify(
      {
        personNames: personNames.map((mention) => mention.normalizedText),
        fridayClassifiedAsPerson: personNames.some(
          (mention) => mention.normalizedText === "friday"
        ),
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
