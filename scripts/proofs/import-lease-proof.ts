import { PrismaImportLeaseRepository } from "@/lib/infrastructure/import-lease/prisma-import-lease-repository";
import { prisma } from "@/lib/infrastructure/prisma/client";
import { BasicImportLeaseEngine } from "@/lib/kernel/import-lease";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  await prisma.importLease.deleteMany({
    where: {
      sourceSystem: "proof-provider",
    },
  });

  const identity = {
    sourceSystem: "proof-provider",
    externalImportId: "historical-import",
  };

  const engine = new BasicImportLeaseEngine(new PrismaImportLeaseRepository());

  const firstAcquire = await engine.acquire({
    identity,
    ownerId: "worker-a",
    now: new Date("2026-01-01T00:00:00.000Z"),
    ttlMs: 60_000,
  });

  assert(firstAcquire.acquired, "Expected first worker to acquire import lease.");
  assert(
    firstAcquire.lease.ownerId === "worker-a",
    "Expected lease owner to be worker-a."
  );

  const concurrentAcquire = await engine.acquire({
    identity,
    ownerId: "worker-b",
    now: new Date("2026-01-01T00:00:10.000Z"),
    ttlMs: 60_000,
  });

  assert(
    !concurrentAcquire.acquired,
    "Expected second worker to be blocked by active lease."
  );
  assert(
    concurrentAcquire.activeLease.ownerId === "worker-a",
    "Expected active lease to remain owned by worker-a."
  );

  const wrongOwnerRelease = await engine.release({
    identity,
    ownerId: "worker-b",
    now: new Date("2026-01-01T00:00:20.000Z"),
  });

  assert(
    wrongOwnerRelease === null,
    "Expected non-owner release to be rejected."
  );

  const ownerRelease = await engine.release({
    identity,
    ownerId: "worker-a",
    now: new Date("2026-01-01T00:00:30.000Z"),
  });

  assert(ownerRelease !== null, "Expected owner release to succeed.");
  assert(
    ownerRelease.releasedAt !== null,
    "Expected released lease to record releasedAt."
  );

  const postReleaseAcquire = await engine.acquire({
    identity,
    ownerId: "worker-b",
    now: new Date("2026-01-01T00:00:40.000Z"),
    ttlMs: 60_000,
  });

  assert(
    postReleaseAcquire.acquired,
    "Expected another worker to acquire after release."
  );
  assert(
    postReleaseAcquire.lease.ownerId === "worker-b",
    "Expected lease owner to move to worker-b."
  );

  const expiredAcquire = await engine.acquire({
    identity,
    ownerId: "worker-c",
    now: new Date("2026-01-01T00:02:00.000Z"),
    ttlMs: 60_000,
  });

  assert(
    expiredAcquire.acquired,
    "Expected expired lease to be acquirable by a new worker."
  );
  assert(
    expiredAcquire.lease.ownerId === "worker-c",
    "Expected expired lease to move to worker-c."
  );

  console.log("Import lease proof passed.");
  console.log(
    JSON.stringify(
      {
        firstAcquire: firstAcquire.acquired,
        concurrentAcquireBlocked: !concurrentAcquire.acquired,
        wrongOwnerReleaseRejected: wrongOwnerRelease === null,
        ownerReleaseSucceeded: ownerRelease !== null,
        postReleaseAcquire: postReleaseAcquire.acquired,
        expiredAcquire: expiredAcquire.acquired,
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
