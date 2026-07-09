import assert from "node:assert/strict";

import {
  BasicContextReflectionEngine,
  BasicContextReflectionReasoningInputBuilder,
  BasicExecutiveBriefBuilder,
  BasicExecutiveReasoningEngine,
  BasicExecutiveReasoningProvider,
} from "@/lib/executive";

async function main(): Promise<void> {
  const sourceEventId = "event-executive-reasoning-proof";

  const contextInput = {
    eventId: sourceEventId,
    signals: [
      {
        kind: "unresolved_obligation",
        label: "Unresolved obligation",
        summary:
          "The operator appears to have an unfinished insurance obligation.",
        confidence: 0.84,
        payload: {
          text: "Jess is mad at me for not contacting insurance.",
        },
      },
      {
        kind: "relationship_impact",
        label: "Relationship impact",
        summary:
          "The unfinished insurance obligation may be affecting Jess.",
        confidence: 0.78,
        payload: {
          text: "Jess is mad at me for not contacting insurance.",
        },
      },
    ],
  };

  const reflection =
    await new BasicContextReflectionEngine().reflect(contextInput);

  assert.equal(
    reflection.evidence.sourceEventId,
    sourceEventId,
    "Expected context reflection to preserve source event provenance."
  );

  assert.equal(
    reflection.importance,
    "high",
    "Expected obligation or relationship impact evidence to produce high importance."
  );

  const reasoningInput =
    new BasicContextReflectionReasoningInputBuilder().build({
      sourceText:
        "Jess is mad at me for not contacting insurance.",
      reflection,
      contextInput,
    });

  assert.equal(
    reasoningInput.evidence.length,
    3,
    "Expected two signal evidence records and one reflection evidence record."
  );

  assert(
    reasoningInput.evidence.every(
      (evidence) => evidence.source === sourceEventId
    ),
    "Expected reasoning evidence to preserve source event provenance."
  );

  const reasoning =
    await new BasicExecutiveReasoningEngine(
      new BasicExecutiveReasoningProvider()
    ).reason(reasoningInput);

  assert.equal(
    reasoning.priorities.length,
    2,
    "Expected obligation and relationship evidence to produce two priorities."
  );

  const obligationPriority = reasoning.priorities.find(
    (priority) => priority.title === "Resolve unresolved obligation"
  );

  assert(
    obligationPriority,
    "Expected an unresolved obligation priority."
  );

  assert(
    obligationPriority.evidenceIds.every((evidenceId) =>
      reasoningInput.evidence.some(
        (evidence) => evidence.id === evidenceId
      )
    ),
    "Expected priority evidence references to resolve to reasoning input evidence."
  );

  const identityReasoning = await new BasicExecutiveReasoningEngine(
    new BasicExecutiveReasoningProvider()
  ).reason({
    input: "I still have not contacted the insurance company.",
    evidence: [
      {
        id: "recalled:insurance",
        label: "Recalled concern obligation evidence: Contact insurance",
        summary:
          "Stable semantic identity evidence associated with this executive concern.",
        confidence: 0.86,
        source:
          "concern-identity:obligation:current-operator:insurance",
        identityEvidenceIds: [
          "concern-identity:obligation:current-operator:insurance",
        ],
      },
    ],
  });

  assert(
    identityReasoning.priorities.some((priority) =>
      priority.identityEvidenceIds?.includes(
        "concern-identity:obligation:current-operator:insurance"
      )
    ),
    "Expected reasoned priority to preserve stable identity provenance."
  );

  const brief =
    new BasicExecutiveBriefBuilder().build({
      reasoningInput,
      reasoningResult: reasoning,
    });

  assert.equal(
    brief.priorities.length,
    reasoning.priorities.length,
    "Expected the executive brief to preserve reasoned priorities."
  );

  assert.equal(
    brief.priorities[0].whyItMatters,
    reasoning.priorities[0].rationale,
    "Expected the executive brief to preserve reasoning rationale."
  );

  assert.equal(
    brief.priorities[0].suggestedNextStep,
    reasoning.priorities[0].suggestedNextStep,
    "Expected the executive brief to preserve the suggested next step."
  );

  assert(
    brief.priorities.every((priority) =>
      priority.evidence.every(
        (evidence) => !evidence.includes(":signal:")
      )
    ),
    "Expected the executive brief not to expose internal evidence IDs."
  );

  assert(
    brief.priorities.some((priority) =>
      priority.evidence.some((evidence) =>
        evidence.includes(
          "The operator appears to have an unfinished insurance obligation."
        )
      )
    ),
    "Expected the executive brief to preserve rich semantic evidence summaries."
  );

  const emptyContextInput = {
    eventId: "event-empty-executive-reasoning-proof",
    signals: [],
  };

  const emptyReflection =
    await new BasicContextReflectionEngine().reflect(emptyContextInput);

  const emptyReasoningInput =
    new BasicContextReflectionReasoningInputBuilder().build({
      sourceText: "Nothing notable happened.",
      reflection: emptyReflection,
      contextInput: emptyContextInput,
    });

  const emptyReasoning =
    await new BasicExecutiveReasoningEngine(
      new BasicExecutiveReasoningProvider()
    ).reason(emptyReasoningInput);

  assert.equal(
    emptyReasoning.priorities.length,
    0,
    "Expected empty contextual evidence not to fabricate executive priorities."
  );

  const emptyBrief =
    new BasicExecutiveBriefBuilder().build({
      reasoningInput: emptyReasoningInput,
      reasoningResult: emptyReasoning,
    });

  assert.equal(
    emptyBrief.priorities.length,
    0,
    "Expected an empty reasoning result to produce an empty executive brief."
  );

  console.log("Executive reasoning proof passed.");
  console.log(
    JSON.stringify(
      {
        sourceProvenancePreserved:
          reflection.evidence.sourceEventId === sourceEventId,
        reasoningEvidenceCount: reasoningInput.evidence.length,
        reasonedPriorityCount: reasoning.priorities.length,
        identityProvenancePreserved:
          identityReasoning.priorities.some((priority) =>
            priority.identityEvidenceIds?.includes(
              "concern-identity:obligation:current-operator:insurance"
            )
          ),
        briefPriorityCount: brief.priorities.length,
        emptyEvidenceFabricatedPriorities:
          emptyReasoning.priorities.length > 0,
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
