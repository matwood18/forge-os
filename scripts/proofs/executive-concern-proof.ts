import { InMemoryExecutiveConcernRepository } from "@/lib/executive/concern";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}


async function main(): Promise<void> {
  const repository = new InMemoryExecutiveConcernRepository();

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const secondObserved = new Date("2026-07-09T10:00:00.000Z");
  const resolvedAt = new Date("2026-07-09T12:00:00.000Z");

  const created = await repository.create({
    id: "concern:jess-insurance",
    title: "Jess upset about insurance",
    importance: "high",
    confidence: 0.74,
    observedAt: firstObserved,
    evidence: [
      {
        id: "attention:jess-insurance:1",
        kind: "executiveAttention",
        summary: "Jess may be affected by unresolved insurance follow-up.",
        observedAt: firstObserved,
        sourceId: "execution:phase-43-proof:1",
      },
    ],
    latestRecommendation: {
      id: "recommendation:call-insurance",
      summary: "Insurance follow-up appears to deserve attention.",
      suggestedNextStep: "Call insurance and update Jess.",
      createdAt: firstObserved,
      evidenceIds: ["attention:jess-insurance:1"],
    },
  });

  const updated = await repository.update({
    id: created.id,
    importance: "critical",
    confidence: 0.86,
    observedAt: secondObserved,
    evidence: [
      {
        id: "attention:jess-insurance:2",
        kind: "operatorUpdate",
        summary: "The concern was mentioned again and remains unresolved.",
        observedAt: secondObserved,
        sourceId: "manual:update:1",
      },
    ],
  });

  const resolved = await repository.update({
    id: created.id,
    status: "resolved",
    observedAt: resolvedAt,
    evidence: [
      {
        id: "resolution:jess-insurance:1",
        kind: "resolution",
        summary: "Insurance was called and Jess was updated.",
        observedAt: resolvedAt,
        sourceId: "manual:resolution:1",
      },
    ],
    resolution: {
      resolvedAt,
      summary: "Insurance follow-up completed.",
      evidenceIds: ["resolution:jess-insurance:1"],
    },
  });

  assert(created.firstObserved.getTime() === firstObserved.getTime(), "first observed is preserved");
  assert(updated.lastObserved.getTime() === secondObserved.getTime(), "last observed advances");
  assert(updated.supportingEvidence.length === 2, "new evidence accumulates");
  assert(updated.importance === "critical", "importance can increase");
  assert(updated.confidence === 0.86, "confidence can change");
  assert(resolved.status === "resolved", "concern can be resolved");
  assert(Boolean(resolved.resolution), "resolution history is preserved");
  assert((await repository.listByStatus("resolved")).length === 1, "resolved concerns remain queryable");
  assert((await repository.list()).length === 1, "repository preserves concern history");

  console.log("Executive concern proof passed.");
  console.log(
    JSON.stringify(
      {
        concernCreated: created.id,
        evidenceAccumulated: updated.supportingEvidence.length,
        firstObservedPreserved: created.firstObserved.toISOString(),
        lastObservedAdvanced: updated.lastObserved.toISOString(),
        resolvedConcernStillStored: (await repository.listByStatus("resolved")).length === 1,
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
