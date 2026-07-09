import {
  BasicExecutiveConcernCoordinator,
} from "@/lib/executive/concern-coordination";

import {
  InMemoryExecutiveConcernRepository,
} from "@/lib/executive/concern";

import {
  BasicExecutiveConcernIdentityCandidateSource,
  BasicExecutiveConcernIdentityResolver,
} from "@/lib/executive/concern-identity";

import {
  BasicExecutiveConcernReconciliationEngine,
} from "@/lib/executive/concern-reconciliation";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  const repository = new InMemoryExecutiveConcernRepository();

  const coordinator = new BasicExecutiveConcernCoordinator(
    repository,
    new BasicExecutiveConcernReconciliationEngine(),
    new BasicExecutiveConcernIdentityResolver(),
    new BasicExecutiveConcernIdentityCandidateSource(repository)
  );

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const secondObserved = new Date("2026-07-09T10:00:00.000Z");
  const thirdObserved = new Date("2026-07-09T11:00:00.000Z");

  const firstResult = await coordinator.coordinate({
    projection: {
      generatedAt: firstObserved,
      observations: [
        {
          concernId: "concern:call-insurance",
          title: "Call insurance",
          importance: "high",
          confidence: 0.8,
          observedAt: firstObserved,
          identityEvidenceIds: ["evidence:insurance"],
          evidence: [
            {
              id: "concern-evidence:attention:call-insurance",
              kind: "executiveAttention",
              summary: "Forge surfaced insurance follow-up as attention.",
              observedAt: firstObserved,
              sourceId: "evidence:insurance",
            },
          ],
        },
      ],
    },
  });

  assert(firstResult.createdCount === 1, "first observation should create concern");

  const secondResult = await coordinator.coordinate({
    projection: {
      generatedAt: secondObserved,
      observations: [
        {
          concernId:
            "concern:insurance-company-still-needs-follow-up",
          title: "Insurance company still needs follow-up",
          importance: "high",
          confidence: 0.9,
          observedAt: secondObserved,
          identityEvidenceIds: ["evidence:insurance"],
          evidence: [
            {
              id: "concern-evidence:operator-update:insurance-still-open",
              kind: "operatorUpdate",
              summary:
                "The insurance concern was mentioned again with different wording.",
              observedAt: secondObserved,
              sourceId: "evidence:insurance",
            },
          ],
        },
      ],
    },
  });

  const concern = await repository.findById("concern:call-insurance");

  assert(secondResult.createdCount === 0, "resolved identity should not create duplicate concern");
  assert(secondResult.updatedCount === 1, "resolved identity should update the existing concern");
  assert(secondResult.ambiguousCount === 0, "resolved identity should not be ambiguous");
  assert((await repository.list()).length === 1, "repository should still contain one concern");
  assert(Boolean(concern), "original durable concern should remain queryable");
  assert(
    concern?.supportingEvidence.length === 2,
    "stable concern should accumulate differently worded evidence"
  );
  assert(
    secondResult.records[0].kind === "reconciled" &&
      secondResult.records[0].identityResult?.kind === "resolved",
    "coordination should preserve resolved identity result"
  );

  await repository.create({
    id: "concern:ambiguous:first",
    title: "First ambiguous concern",
    importance: "high",
    confidence: 0.8,
    observedAt: firstObserved,
    evidence: [
      {
        id: "concern-evidence:ambiguous:first",
        kind: "executiveAttention",
        summary: "First ambiguous concern.",
        observedAt: firstObserved,
        sourceId: "evidence:shared",
      },
    ],
  });

  await repository.create({
    id: "concern:ambiguous:second",
    title: "Second ambiguous concern",
    importance: "high",
    confidence: 0.8,
    observedAt: firstObserved,
    evidence: [
      {
        id: "concern-evidence:ambiguous:second",
        kind: "executiveAttention",
        summary: "Second ambiguous concern.",
        observedAt: firstObserved,
        sourceId: "evidence:shared",
      },
    ],
  });

  const beforeAmbiguousCount = (await repository.list()).length;

  const ambiguousResult = await coordinator.coordinate({
    projection: {
      generatedAt: thirdObserved,
      observations: [
        {
          concernId: "concern:presentation:shared",
          title: "Shared evidence concern",
          importance: "high",
          confidence: 0.8,
          observedAt: thirdObserved,
          identityEvidenceIds: ["evidence:shared"],
          evidence: [
            {
              id: "concern-evidence:shared:new",
              kind: "operatorUpdate",
              summary: "Shared evidence could match more than one concern.",
              observedAt: thirdObserved,
              sourceId: "evidence:shared",
            },
          ],
        },
      ],
    },
  });

  assert(
    ambiguousResult.ambiguousCount === 1,
    "ambiguous identity should be counted explicitly"
  );
  assert(
    ambiguousResult.createdCount === 0 && ambiguousResult.updatedCount === 0,
    "ambiguous identity should not mutate durable concerns"
  );
  assert(
    (await repository.list()).length === beforeAmbiguousCount,
    "ambiguous identity should not create duplicate durable concerns"
  );
  assert(
    ambiguousResult.records[0].kind === "identity_ambiguous",
    "ambiguous coordination record should preserve identity ambiguity"
  );

  console.log("Executive concern identity coordination proof passed.");
  console.log(
    JSON.stringify(
      {
        firstPassCreated: firstResult.createdCount,
        secondPassUpdated: secondResult.updatedCount,
        durableConcernCountAfterResolvedIdentity: 1,
        accumulatedEvidenceCount: concern?.supportingEvidence.length,
        resolvedIdentityPreserved:
          secondResult.records[0].kind === "reconciled" &&
          secondResult.records[0].identityResult?.kind === "resolved",
        ambiguousCount: ambiguousResult.ambiguousCount,
        ambiguousMutationBlocked:
          (await repository.list()).length === beforeAmbiguousCount,
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
