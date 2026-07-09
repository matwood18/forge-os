import {
  executiveConcernCoordinator,
  executiveConcernProjector,
  executiveConcernRepository,
} from "@/lib/executive/concern-runtime";

import type {
  ExecutiveAttentionResult,
} from "@/lib/executive/attention";

import type {
  ExecutiveOutput,
} from "@/lib/executive/output";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}


async function main(): Promise<void> {
  await executiveConcernRepository.clear();

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const secondObserved = new Date("2026-07-09T10:00:00.000Z");

  function attentionAt(
    observedAt: Date,
    confidence: number
  ): ExecutiveAttentionResult {
    return {
      generatedAt: observedAt,
      attention: [
        {
          priority: {
            priority: {
              title: "Contact insurance",
              rationale: "Jess is affected by unresolved insurance follow-up.",
              suggestedNextStep: "Contact insurance and update Jess.",
              evidenceIds: ["evidence:insurance"],
              confidence,
            },
            comparisonSignals: [],
            executiveWeight: 40,
            originalIndex: 0,
          },
          state: "surfaced",
          selectionDecision: "surface",
          selectionSignals: [
            {
              kind: "requiresUserAttention",
              label: "User action appears required",
              weight: 30,
              evidenceIds: ["evidence:insurance"],
            },
          ],
          createdAt: observedAt,
        },
      ],
    };
  }

  function outputAt(
    observedAt: Date,
    confidence: number
  ): ExecutiveOutput {
    return {
      suggestions: [
        {
          id: "suggestion:1:contact-insurance",
          title: "Contact insurance",
          whyItMatters:
            "Jess is affected, and the insurance responsibility remains unresolved.",
          suggestedNextStep:
            "Contact insurance and update Jess with the outcome.",
          evidence: [
            {
              id: "evidence:insurance",
              label:
                "Executive situation: Insurance responsibility affecting Jess",
              summary:
                "Jess appears affected by an unresolved insurance responsibility.",
              confidence,
              source: "execution:test",
            },
          ],
          confidence,
          status: "pending",
          createdAt: observedAt,
        },
      ],
      clarifications: [],
      summary: {
        suggestionCount: 1,
        clarificationCount: 0,
        hasActionableSuggestions: true,
        hasPendingClarifications: false,
      },
      generatedAt: observedAt,
    };
  }

  const firstProjection = executiveConcernProjector.project({
    attention: attentionAt(firstObserved, 0.74),
    output: outputAt(firstObserved, 0.74),
  });

  const firstResult = await executiveConcernCoordinator.coordinate({
    projection: firstProjection,
  });

  const secondProjection = executiveConcernProjector.project({
    attention: attentionAt(secondObserved, 0.88),
    output: outputAt(secondObserved, 0.88),
  });

  const secondResult = await executiveConcernCoordinator.coordinate({
    projection: secondProjection,
  });

  const concern = await executiveConcernRepository.findById(
    "concern:contact-insurance"
  );

  assert(firstResult.createdCount === 1, "first runtime pass should create concern");
  assert(secondResult.createdCount === 0, "second runtime pass should not create duplicate");
  assert(secondResult.updatedCount === 1, "second runtime pass should update concern");
  assert((await executiveConcernRepository.list()).length === 1, "runtime should retain one concern");
  assert(Boolean(concern), "runtime concern should remain queryable");
  assert(concern?.confidence === 0.88, "runtime should preserve latest confidence");
  assert(
    concern?.firstObserved.getTime() === firstObserved.getTime(),
    "runtime should preserve first observed time"
  );
  assert(
    concern?.lastObserved.getTime() === secondObserved.getTime(),
    "runtime should advance last observed time"
  );

  console.log("Executive concern runtime integration proof passed.");
  console.log(
    JSON.stringify(
      {
        firstPassCreated: firstResult.createdCount,
        secondPassUpdated: secondResult.updatedCount,
        concernCount: (await executiveConcernRepository.list()).length,
        firstObservedPreserved:
          concern?.firstObserved.toISOString() === firstObserved.toISOString(),
        lastObservedAdvanced:
          concern?.lastObserved.toISOString() === secondObserved.toISOString(),
        latestConfidence: concern?.confidence,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
