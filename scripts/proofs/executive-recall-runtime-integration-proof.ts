import {
  BasicExecutiveRecallContextProjector,
  BasicExecutiveRecallProjector,
  BasicRecallContextReasoningInputBuilder,
  InMemoryExecutiveConcernRepository,
} from "@/lib/executive";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  const repository = new InMemoryExecutiveConcernRepository();

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const lastObserved = new Date("2026-07-09T10:00:00.000Z");
  const generatedAt = new Date("2026-07-09T11:00:00.000Z");

  await repository.create({
    id: "concern:contact-insurance",
    title: "Contact insurance",
    importance: "high",
    confidence: 0.88,
    observedAt: firstObserved,
    evidence: [
      {
        id: "evidence:insurance",
        kind: "executiveAttention",
        summary:
          "Insurance responsibility remains unresolved and affects Jess.",
        observedAt: firstObserved,
        sourceId: "source:previous-execution",
      },
      {
        id:
          "concern-evidence:identity:concern-identity:obligation:current-operator:insurance",
        kind: "identityEvidence",
        summary:
          "Stable semantic identity evidence associated with this executive concern.",
        observedAt: firstObserved,
        sourceId:
          "concern-identity:obligation:current-operator:insurance",
      },
    ],
    latestRecommendation: {
      id: "recommendation:insurance",
      summary: "Insurance follow-up appears to deserve attention.",
      suggestedNextStep: "Contact insurance and update Jess.",
      createdAt: lastObserved,
      evidenceIds: ["evidence:insurance"],
    },
    clarificationNeeded: {
      id: "clarification:insurance",
      question: "Did you already contact insurance?",
      reason:
        "Resolution status changes whether this still deserves attention.",
      createdAt: lastObserved,
      evidenceIds: ["evidence:insurance"],
    },
  });

  const recallResult = await new BasicExecutiveRecallProjector(
    repository
  ).project({
    maxConcerns: 3,
    asOf: generatedAt,
  });

  const recallContext =
    new BasicExecutiveRecallContextProjector().project(recallResult);

  const reasoningInput =
    new BasicRecallContextReasoningInputBuilder().build({
      sourceText: "I need to figure out what matters today.",
      recallContext,
    });

  assert(
    recallResult.recalledConcerns.length === 1,
    "Expected recall to include unresolved durable concern."
  );
  assert(
    recallContext.concerns.length === 1,
    "Expected recall context to include one reasoning-safe concern."
  );
  assert(
    reasoningInput.evidence.some(
      (evidence) => evidence.id === "concern:contact-insurance:recall"
    ),
    "Expected reasoning input to include recalled concern evidence."
  );
  assert(
    reasoningInput.evidence.some(
      (evidence) =>
        evidence.id ===
        "concern:contact-insurance:evidence:evidence:insurance"
    ),
    "Expected reasoning input to include recalled supporting evidence."
  );
  assert(
    reasoningInput.evidence.some(
      (evidence) =>
        evidence.identityEvidenceIds?.includes(
          "concern-identity:obligation:current-operator:insurance"
        )
    ),
    "Expected recalled concern evidence to preserve stable identity evidence ids."
  );
  assert(
    reasoningInput.evidence.some(
      (evidence) =>
        evidence.id ===
        "concern:contact-insurance:latest-recommendation"
    ),
    "Expected reasoning input to include latest recalled recommendation."
  );
  assert(
    reasoningInput.evidence.some(
      (evidence) =>
        evidence.id ===
        "concern:contact-insurance:clarification-needed"
    ),
    "Expected reasoning input to include recalled clarification need."
  );
  assert(
    reasoningInput.evidence.every(
      (evidence) => !evidence.id.includes("resolution")
    ),
    "Expected unresolved recall integration not to leak resolution payloads."
  );

  console.log("Executive recall runtime integration proof passed.");
  console.log(
    JSON.stringify(
      {
        recalledConcernCount: recallResult.recalledConcerns.length,
        recallContextConcernCount: recallContext.concerns.length,
        reasoningEvidenceCount: reasoningInput.evidence.length,
        includesRecallEvidence: true,
        includesIdentityEvidence: true,
        includesRecommendationEvidence: true,
        includesClarificationEvidence: true,
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
