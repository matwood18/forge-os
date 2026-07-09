import {
  BasicExecutiveRecallContextProjector,
  type ExecutiveRecallResult,
} from "@/lib/executive";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function main(): void {
  const generatedAt = new Date("2026-07-09T11:00:00.000Z");
  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const lastObserved = new Date("2026-07-09T10:00:00.000Z");

  const recallResult: ExecutiveRecallResult = {
    generatedAt,
    maxConcerns: 3,
    totalConcernCount: 2,
    excludedConcernCount: 1,
    recalledConcerns: [
      {
        reason: "Open concern remains unresolved across executions.",
        evidenceIds: ["evidence:insurance"],
        concern: {
          id: "concern:contact-insurance",
          title: "Contact insurance",
          status: "open",
          importance: "high",
          confidence: 0.88,
          firstObserved,
          lastObserved,
          supportingEvidence: [
            {
              id: "evidence:insurance",
              kind: "executiveAttention",
              summary:
                "Insurance responsibility remains unresolved and affects Jess.",
              observedAt: lastObserved,
              sourceId: "source:message:jess-insurance",
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
        },
      },
    ],
  };

  const projector = new BasicExecutiveRecallContextProjector();
  const context = projector.project(recallResult);

  assert(
    context.generatedAt.getTime() === generatedAt.getTime(),
    "Expected context to preserve generation time."
  );
  assert(
    context.recalledConcernCount === 1,
    "Expected context to report recalled concern count."
  );
  assert(
    context.totalConcernCount === 2,
    "Expected context to preserve total concern count."
  );
  assert(
    context.excludedConcernCount === 1,
    "Expected context to preserve excluded concern count."
  );
  assert(
    context.concerns[0].id === "concern:contact-insurance",
    "Expected context to preserve concern identity."
  );
  assert(
    context.concerns[0].reason ===
      "Open concern remains unresolved across executions.",
    "Expected context to preserve recall reason."
  );
  assert(
    context.concerns[0].evidence[0].id === "evidence:insurance",
    "Expected context to preserve evidence identity."
  );
  assert(
    context.concerns[0].evidence[0].sourceId ===
      "source:message:jess-insurance",
    "Expected context to preserve evidence source identity."
  );
  assert(
    context.concerns[0].latestRecommendation?.suggestedNextStep ===
      "Contact insurance and update Jess.",
    "Expected context to preserve latest recommendation."
  );
  assert(
    context.concerns[0].clarificationNeeded?.question ===
      "Did you already contact insurance?",
    "Expected context to preserve clarification need."
  );
  assert(
    !("supportingEvidence" in context.concerns[0]),
    "Expected context not to expose full concern objects."
  );
  assert(
    !("resolution" in context.concerns[0]),
    "Expected context not to expose resolution payload."
  );

  console.log("Executive recall context proof passed.");
  console.log(
    JSON.stringify(
      {
        recalledConcernCount: context.recalledConcernCount,
        totalConcernCount: context.totalConcernCount,
        excludedConcernCount: context.excludedConcernCount,
        concernId: context.concerns[0].id,
        evidencePreserved: context.concerns[0].evidence.length,
        recommendationPreserved: Boolean(
          context.concerns[0].latestRecommendation
        ),
        clarificationPreserved: Boolean(
          context.concerns[0].clarificationNeeded
        ),
        fullConcernNotExposed: true,
      },
      null,
      2
    )
  );
}

main();
