import {
  InMemoryExecutiveConcernRepository,
} from "@/lib/executive/concern";

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
  const engine = new BasicExecutiveConcernReconciliationEngine();

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const secondObserved = new Date("2026-07-09T10:00:00.000Z");

  const firstObservation = {
    concernId: "concern:jess-insurance",
    title: "Jess upset about insurance",
    importance: "high" as const,
    confidence: 0.74,
    observedAt: firstObserved,
    evidence: [
      {
        id: "attention:jess-insurance:1",
        kind: "executiveAttention" as const,
        summary: "Insurance follow-up appears to affect Jess.",
        observedAt: firstObserved,
      },
    ],
  };

  const createDecision = engine.reconcile({
    observation: firstObservation,
  });

  assert(createDecision.kind === "create", "new concern should be created");

  if (createDecision.kind !== "create") {
    throw new Error("Expected create decision");
  }

  const created = await repository.create(createDecision.createInput);

  const duplicateDecision = engine.reconcile({
    existingConcern: created,
    observation: firstObservation,
  });

  assert(
    duplicateDecision.kind === "no_change",
    "duplicate observation should not mutate concern"
  );

  const repeatedObservation = {
    ...firstObservation,
    importance: "critical" as const,
    confidence: 0.86,
    observedAt: secondObserved,
    evidence: [
      ...firstObservation.evidence,
      {
        id: "attention:jess-insurance:2",
        kind: "operatorUpdate" as const,
        summary: "The unresolved concern was mentioned again.",
        observedAt: secondObserved,
      },
    ],
  };

  const updateDecision = engine.reconcile({
    existingConcern: created,
    observation: repeatedObservation,
  });

  assert(updateDecision.kind === "update", "new evidence should update concern");

  if (updateDecision.kind !== "update") {
    throw new Error("Expected update decision");
  }

  const updated = await repository.update(updateDecision.updateInput);

  assert(updated.supportingEvidence.length === 2, "evidence should accumulate");
  assert(updated.importance === "critical", "importance should update");
  assert(updated.confidence === 0.86, "confidence should update");
  assert(
    updated.firstObserved.getTime() === firstObserved.getTime(),
    "first observed should remain stable"
  );
  assert(
    updated.lastObserved.getTime() === secondObserved.getTime(),
    "last observed should advance"
  );
  assert(updated.status === "open", "reconciliation must not auto-resolve concerns");

  let mismatchedIdentityRejected = false;

  try {
    engine.reconcile({
      existingConcern: updated,
      observation: {
        ...repeatedObservation,
        concernId: "concern:different",
      },
    });
  } catch {
    mismatchedIdentityRejected = true;
  }

  assert(
    mismatchedIdentityRejected,
    "mismatched concern identity should be rejected"
  );

  console.log("Executive concern reconciliation proof passed.");
  console.log(
    JSON.stringify(
      {
        created: createDecision.kind === "create",
        duplicateIgnored: duplicateDecision.kind === "no_change",
        repeatedConcernUpdated: updateDecision.kind === "update",
        evidenceAccumulated: updated.supportingEvidence.length,
        firstObservedPreserved:
          updated.firstObserved.toISOString() === firstObserved.toISOString(),
        lastObservedAdvanced:
          updated.lastObserved.toISOString() === secondObserved.toISOString(),
        autoResolved: updated.status === "resolved",
        mismatchedIdentityRejected,
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
