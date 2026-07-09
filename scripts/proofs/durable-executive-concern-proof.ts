import { PrismaExecutiveConcernRepository } from "@/lib/infrastructure/executive-concern";
import { prisma } from "@/lib/infrastructure/prisma/client";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  await prisma.executiveConcern.deleteMany({
    where: {
      id: {
        startsWith: "proof-executive-concern:",
      },
    },
  });

  const firstRepository = new PrismaExecutiveConcernRepository();

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const secondObserved = new Date("2026-07-09T10:00:00.000Z");

  await firstRepository.create({
    id: "proof-executive-concern:contact-insurance",
    title: "Contact insurance",
    importance: "high",
    confidence: 0.74,
    observedAt: firstObserved,
    evidence: [
      {
        id: "proof-evidence:attention:contact-insurance",
        kind: "executiveAttention",
        summary: "Forge surfaced this priority as executive attention.",
        observedAt: firstObserved,
      },
    ],
    latestRecommendation: {
      id: "proof-recommendation:contact-insurance",
      summary: "Insurance follow-up appears to deserve attention.",
      suggestedNextStep: "Contact insurance and update Jess.",
      createdAt: firstObserved,
      evidenceIds: ["proof-evidence:attention:contact-insurance"],
    },
  });

  const resumedRepository = new PrismaExecutiveConcernRepository();

  const resumed = await resumedRepository.findById(
    "proof-executive-concern:contact-insurance"
  );

  assert(resumed !== undefined, "Expected concern to persist across repository instances.");
  assert(resumed.title === "Contact insurance", "Expected title to persist.");
  assert(resumed.confidence === 0.74, "Expected confidence to persist.");
  assert(
    resumed.firstObserved.getTime() === firstObserved.getTime(),
    "Expected first observed to persist."
  );
  assert(
    resumed.supportingEvidence.length === 1,
    "Expected supporting evidence to persist."
  );
  assert(
    resumed.latestRecommendation?.suggestedNextStep ===
      "Contact insurance and update Jess.",
    "Expected latest recommendation to persist."
  );

  const updated = await resumedRepository.update({
    id: resumed.id,
    importance: "critical",
    confidence: 0.88,
    observedAt: secondObserved,
    evidence: [
      {
        id: "proof-evidence:operator-update:contact-insurance",
        kind: "operatorUpdate",
        summary: "The unresolved insurance concern was mentioned again.",
        observedAt: secondObserved,
      },
    ],
  });

  const listed = await resumedRepository.listByStatus("open");

  assert(updated.importance === "critical", "Expected importance to update.");
  assert(updated.confidence === 0.88, "Expected confidence to update.");
  assert(
    updated.firstObserved.getTime() === firstObserved.getTime(),
    "Expected first observed to remain stable."
  );
  assert(
    updated.lastObserved.getTime() === secondObserved.getTime(),
    "Expected last observed to advance."
  );
  assert(
    updated.supportingEvidence.length === 2,
    "Expected evidence to accumulate."
  );
  assert(
    listed.some((concern) => concern.id === updated.id),
    "Expected open concern to remain queryable by status."
  );

  console.log("Durable executive concern proof passed.");
  console.log(
    JSON.stringify(
      {
        persistedAcrossRepositoryInstances: true,
        evidenceAccumulated: updated.supportingEvidence.length,
        firstObservedPreserved:
          updated.firstObserved.toISOString() === firstObserved.toISOString(),
        lastObservedAdvanced:
          updated.lastObserved.toISOString() === secondObserved.toISOString(),
        latestConfidence: updated.confidence,
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
