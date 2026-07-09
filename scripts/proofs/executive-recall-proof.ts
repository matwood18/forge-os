import {
  BasicExecutiveRecallProjector,
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
  const olderObserved = new Date("2026-07-09T09:00:00.000Z");
  const newerObserved = new Date("2026-07-09T10:00:00.000Z");
  const generatedAt = new Date("2026-07-09T11:00:00.000Z");

  await repository.create({
    id: "concern:low-open",
    title: "Low open concern",
    importance: "low",
    confidence: 0.5,
    observedAt: firstObserved,
    evidence: [
      {
        id: "evidence:low-open",
        kind: "executiveAttention",
        summary: "Low concern evidence.",
        observedAt: firstObserved,
      },
    ],
  });

  await repository.create({
    id: "concern:critical-old",
    title: "Critical older concern",
    importance: "critical",
    confidence: 0.91,
    observedAt: olderObserved,
    evidence: [
      {
        id: "evidence:critical-old",
        kind: "executiveAttention",
        summary: "Critical older concern evidence.",
        observedAt: olderObserved,
        sourceId: "source:critical-old",
      },
    ],
    latestRecommendation: {
      id: "recommendation:critical-old",
      summary: "Critical older concern recommendation.",
      suggestedNextStep: "Address the older critical concern.",
      createdAt: olderObserved,
      evidenceIds: ["evidence:critical-old"],
    },
  });

  await repository.create({
    id: "concern:critical-new",
    title: "Critical newer concern",
    importance: "critical",
    confidence: 0.93,
    observedAt: newerObserved,
    evidence: [
      {
        id: "evidence:critical-new",
        kind: "operatorUpdate",
        summary: "Critical newer concern evidence.",
        observedAt: newerObserved,
        sourceId: "source:critical-new",
      },
    ],
    clarificationNeeded: {
      id: "clarification:critical-new",
      question: "Is this still blocked?",
      reason: "The unresolved concern may change today's priority.",
      createdAt: newerObserved,
      evidenceIds: ["evidence:critical-new"],
    },
  });

  await repository.create({
    id: "concern:resolved",
    title: "Resolved concern",
    importance: "critical",
    confidence: 0.99,
    observedAt: newerObserved,
    evidence: [
      {
        id: "evidence:resolved",
        kind: "resolution",
        summary: "Resolved concern evidence.",
        observedAt: newerObserved,
      },
    ],
  });

  await repository.update({
    id: "concern:resolved",
    status: "resolved",
    resolution: {
      resolvedAt: newerObserved,
      summary: "The concern was explicitly resolved.",
      evidenceIds: ["evidence:resolved"],
    },
  });

  await repository.create({
    id: "concern:dismissed",
    title: "Dismissed concern",
    importance: "high",
    confidence: 0.8,
    observedAt: newerObserved,
    evidence: [
      {
        id: "evidence:dismissed",
        kind: "operatorUpdate",
        summary: "Dismissed concern evidence.",
        observedAt: newerObserved,
      },
    ],
  });

  await repository.update({
    id: "concern:dismissed",
    status: "dismissed",
  });

  const projector = new BasicExecutiveRecallProjector(repository);

  const boundedResult = await projector.project({
    maxConcerns: 2,
    asOf: generatedAt,
  });

  assert(
    boundedResult.generatedAt.getTime() === generatedAt.getTime(),
    "Expected recall result to preserve generation time."
  );
  assert(
    boundedResult.totalConcernCount === 5,
    "Expected recall to report total repository concern count."
  );
  assert(
    boundedResult.recalledConcerns.length === 2,
    "Expected recall to respect max concern bound."
  );
  assert(
    boundedResult.recalledConcerns[0].concern.id === "concern:critical-new",
    "Expected newest critical concern to sort first."
  );
  assert(
    boundedResult.recalledConcerns[1].concern.id === "concern:critical-old",
    "Expected older critical concern to sort second."
  );
  assert(
    boundedResult.recalledConcerns.every(
      (recalled) =>
        recalled.concern.status !== "resolved" &&
        recalled.concern.status !== "dismissed"
    ),
    "Expected recall to exclude resolved and dismissed concerns."
  );
  assert(
    boundedResult.recalledConcerns[0].evidenceIds.includes(
      "evidence:critical-new"
    ),
    "Expected recall to preserve supporting evidence identity."
  );
  assert(
    boundedResult.recalledConcerns[0].concern.clarificationNeeded?.id ===
      "clarification:critical-new",
    "Expected recall to preserve clarification provenance."
  );
  assert(
    boundedResult.recalledConcerns[1].concern.latestRecommendation?.id ===
      "recommendation:critical-old",
    "Expected recall to preserve recommendation provenance."
  );

  const emptyResult = await projector.project({
    maxConcerns: 0,
    asOf: generatedAt,
  });

  assert(
    emptyResult.recalledConcerns.length === 0,
    "Expected zero max concern bound to return no recalled concerns."
  );
  assert(
    emptyResult.excludedConcernCount === 5,
    "Expected empty bounded result to count all concerns as excluded."
  );

  console.log("Executive recall proof passed.");
  console.log(
    JSON.stringify(
      {
        totalConcernCount: boundedResult.totalConcernCount,
        recalledConcernCount: boundedResult.recalledConcerns.length,
        excludedConcernCount: boundedResult.excludedConcernCount,
        firstRecalledConcern: boundedResult.recalledConcerns[0]?.concern.id,
        secondRecalledConcern: boundedResult.recalledConcerns[1]?.concern.id,
        emptyBoundRespected: emptyResult.recalledConcerns.length === 0,
        provenancePreserved: true,
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
