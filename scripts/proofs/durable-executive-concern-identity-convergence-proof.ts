import {
  BasicExecutiveConcernCoordinator,
} from "@/lib/executive/concern-coordination";

import {
  BasicExecutiveConcernIdentityCandidateSource,
  BasicExecutiveConcernIdentityResolver,
} from "@/lib/executive/concern-identity";

import {
  BasicExecutiveConcernReconciliationEngine,
} from "@/lib/executive/concern-reconciliation";

import {
  PrismaExecutiveConcernRepository,
} from "@/lib/infrastructure/executive-concern";

import {
  prisma,
} from "@/lib/infrastructure/prisma/client";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const PROOF_PREFIX = "proof-executive-concern-identity:";

async function clearProofConcerns(): Promise<void> {
  await prisma.executiveConcern.deleteMany({
    where: {
      id: {
        startsWith: PROOF_PREFIX,
      },
    },
  });
}

async function main(): Promise<void> {
  await clearProofConcerns();

  const firstObserved = new Date("2026-07-09T08:00:00.000Z");
  const secondObserved = new Date("2026-07-09T10:00:00.000Z");

  const firstRepository = new PrismaExecutiveConcernRepository();

  const firstCoordinator = new BasicExecutiveConcernCoordinator(
    firstRepository,
    new BasicExecutiveConcernReconciliationEngine(),
    new BasicExecutiveConcernIdentityResolver(),
    new BasicExecutiveConcernIdentityCandidateSource(firstRepository)
  );

  const firstResult = await firstCoordinator.coordinate({
    projection: {
      generatedAt: firstObserved,
      observations: [
        {
          concernId:
            "proof-executive-concern-identity:call-insurance",
          title: "Call insurance",
          importance: "high",
          confidence: 0.78,
          observedAt: firstObserved,
          identityEvidenceIds: [
            "proof-identity-evidence:insurance",
          ],
          evidence: [
            {
              id:
                "proof-concern-evidence:attention:call-insurance",
              kind: "executiveAttention",
              summary:
                "Forge surfaced insurance follow-up as executive attention.",
              observedAt: firstObserved,
              sourceId:
                "proof-identity-evidence:insurance",
            },
          ],
        },
      ],
    },
  });

  assert(
    firstResult.createdCount === 1,
    "first durable pass should create one concern"
  );

  assert(
    firstResult.updatedCount === 0,
    "first durable pass should not update a concern"
  );

  const resumedRepository =
    new PrismaExecutiveConcernRepository();

  const resumedCoordinator =
    new BasicExecutiveConcernCoordinator(
      resumedRepository,
      new BasicExecutiveConcernReconciliationEngine(),
      new BasicExecutiveConcernIdentityResolver(),
      new BasicExecutiveConcernIdentityCandidateSource(
        resumedRepository
      )
    );

  const secondResult = await resumedCoordinator.coordinate({
    projection: {
      generatedAt: secondObserved,
      observations: [
        {
          concernId:
            "proof-executive-concern-identity:insurance-company-still-needs-follow-up",
          title:
            "Insurance company still needs follow-up",
          importance: "high",
          confidence: 0.91,
          observedAt: secondObserved,
          identityEvidenceIds: [
            "proof-identity-evidence:insurance",
          ],
          evidence: [
            {
              id:
                "proof-concern-evidence:operator-update:insurance-still-open",
              kind: "operatorUpdate",
              summary:
                "The unresolved insurance concern was mentioned again using different wording.",
              observedAt: secondObserved,
              sourceId:
                "proof-identity-evidence:insurance",
            },
          ],
        },
      ],
    },
  });

  assert(
    secondResult.createdCount === 0,
    "resolved durable identity should not create a duplicate"
  );

  assert(
    secondResult.updatedCount === 1,
    "resolved durable identity should update the existing concern"
  );

  assert(
    secondResult.ambiguousCount === 0,
    "durable identity convergence should not be ambiguous"
  );

  const proofConcerns = (
    await resumedRepository.list()
  ).filter((concern) =>
    concern.id.startsWith(PROOF_PREFIX)
  );

  assert(
    proofConcerns.length === 1,
    "durable repository should contain exactly one proof concern"
  );

  const concern = proofConcerns[0];

  assert(
    concern.id ===
      "proof-executive-concern-identity:call-insurance",
    "stable durable concern identity should remain the original id"
  );

  assert(
    concern.title === "Call insurance",
    "stable durable concern should preserve its original title"
  );

  assert(
    concern.firstObserved.getTime() ===
      firstObserved.getTime(),
    "durable convergence should preserve first observed time"
  );

  assert(
    concern.lastObserved.getTime() ===
      secondObserved.getTime(),
    "durable convergence should advance last observed time"
  );

  assert(
    concern.confidence === 0.91,
    "durable convergence should preserve latest confidence"
  );

  assert(
    concern.supportingEvidence.length === 2,
    "durable convergence should accumulate evidence"
  );

  assert(
    concern.supportingEvidence.some(
      (evidence) =>
        evidence.id ===
        "proof-concern-evidence:attention:call-insurance"
    ),
    "durable convergence should preserve original evidence"
  );

  assert(
    concern.supportingEvidence.some(
      (evidence) =>
        evidence.id ===
        "proof-concern-evidence:operator-update:insurance-still-open"
    ),
    "durable convergence should preserve later differently worded evidence"
  );

  const secondRecord = secondResult.records[0];

  assert(
    secondRecord.kind === "reconciled",
    "resolved durable identity should produce a reconciled record"
  );

  assert(
    secondRecord.kind === "reconciled" &&
      secondRecord.identityResult?.kind === "resolved",
    "coordination record should preserve resolved identity result"
  );

  assert(
    secondRecord.kind === "reconciled" &&
      secondRecord.identityResult?.kind === "resolved" &&
      secondRecord.identityResult.candidate.concernId ===
        "proof-executive-concern-identity:call-insurance",
    "identity result should point to the original stable durable concern"
  );

  console.log(
    "Durable executive concern identity convergence proof passed."
  );

  console.log(
    JSON.stringify(
      {
        firstPassCreated: firstResult.createdCount,
        secondPassCreated: secondResult.createdCount,
        secondPassUpdated: secondResult.updatedCount,
        durableProofConcernCount: proofConcerns.length,
        stableConcernId: concern.id,
        firstObservedPreserved:
          concern.firstObserved.toISOString() ===
          firstObserved.toISOString(),
        lastObservedAdvanced:
          concern.lastObserved.toISOString() ===
          secondObserved.toISOString(),
        accumulatedEvidenceCount:
          concern.supportingEvidence.length,
        resolvedIdentityPreserved:
          secondRecord.kind === "reconciled" &&
          secondRecord.identityResult?.kind === "resolved",
      },
      null,
      2
    )
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await clearProofConcerns();
    await prisma.$disconnect();
  });
