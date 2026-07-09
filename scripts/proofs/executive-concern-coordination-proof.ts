import {
  InMemoryExecutiveConcernRepository,
} from "@/lib/executive/concern";

import {
  BasicExecutiveConcernCoordinator,
} from "@/lib/executive/concern-coordination";

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
    new BasicExecutiveConcernReconciliationEngine()
  );

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const secondObserved = new Date("2026-07-09T10:00:00.000Z");

  const firstProjection = {
    generatedAt: firstObserved,
    observations: [
      {
        concernId: "concern:contact-insurance",
        title: "Contact insurance",
        importance: "high" as const,
        confidence: 0.74,
        observedAt: firstObserved,
        evidence: [
          {
            id: "concern-evidence:attention:contact-insurance",
            kind: "executiveAttention" as const,
            summary: "Forge surfaced this priority as executive attention.",
            observedAt: firstObserved,
          },
        ],
      },
    ],
  };

  const createdResult = await coordinator.coordinate({
    projection: firstProjection,
  });

  assert(createdResult.createdCount === 1, "first observation should create concern");
  assert(createdResult.updatedCount === 0, "first observation should not update concern");
  assert(createdResult.unchangedCount === 0, "first observation should not be unchanged");
  assert((await repository.list()).length === 1, "repository should contain created concern");

  const duplicateResult = await coordinator.coordinate({
    projection: firstProjection,
  });

  assert(duplicateResult.createdCount === 0, "duplicate should not create concern");
  assert(duplicateResult.updatedCount === 0, "duplicate should not update concern");
  assert(duplicateResult.unchangedCount === 1, "duplicate should be unchanged");

  const secondProjection = {
    generatedAt: secondObserved,
    observations: [
      {
        concernId: "concern:contact-insurance",
        title: "Contact insurance",
        importance: "critical" as const,
        confidence: 0.88,
        observedAt: secondObserved,
        evidence: [
          {
            id: "concern-evidence:attention:contact-insurance",
            kind: "executiveAttention" as const,
            summary: "Forge surfaced this priority as executive attention.",
            observedAt: firstObserved,
          },
          {
            id: "concern-evidence:operator-update:contact-insurance",
            kind: "operatorUpdate" as const,
            summary: "The unresolved insurance concern was mentioned again.",
            observedAt: secondObserved,
          },
        ],
      },
    ],
  };

  const updatedResult = await coordinator.coordinate({
    projection: secondProjection,
  });

  assert(updatedResult.createdCount === 0, "repeat should not create second concern");
  assert(updatedResult.updatedCount === 1, "new evidence should update concern");
  assert(updatedResult.unchangedCount === 0, "new evidence should not be unchanged");
  assert((await repository.list()).length === 1, "repository should still contain one concern");

  const concern = await repository.findById("concern:contact-insurance");

  assert(Boolean(concern), "concern should remain queryable");
  assert(concern?.supportingEvidence.length === 2, "evidence should accumulate");
  assert(concern?.importance === "critical", "importance should update");
  assert(concern?.confidence === 0.88, "confidence should update");
  assert(
    concern?.firstObserved.getTime() === firstObserved.getTime(),
    "first observed should remain stable"
  );
  assert(
    concern?.lastObserved.getTime() === secondObserved.getTime(),
    "last observed should advance"
  );

  console.log("Executive concern coordination proof passed.");
  console.log(
    JSON.stringify(
      {
        firstPassCreated: createdResult.createdCount,
        duplicatePassUnchanged: duplicateResult.unchangedCount,
        repeatedPassUpdated: updatedResult.updatedCount,
        repositoryConcernCount: (await repository.list()).length,
        evidenceAccumulated: concern?.supportingEvidence.length,
        firstObservedPreserved:
          concern?.firstObserved.toISOString() === firstObserved.toISOString(),
        lastObservedAdvanced:
          concern?.lastObserved.toISOString() === secondObserved.toISOString(),
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
