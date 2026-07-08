import { PrismaImportCheckpointRepository } from "@/lib/infrastructure/import-checkpoint/prisma-import-checkpoint-repository";
import { PrismaImportSessionRepository } from "@/lib/infrastructure/import-session/prisma-import-session-repository";
import { prisma } from "@/lib/infrastructure/prisma/client";
import type { ImportSession } from "@/lib/kernel/import-session/types";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  await prisma.importCheckpoint.deleteMany({
    where: { sourceSystem: "proof-provider" },
  });

  await prisma.importSession.deleteMany({
    where: { sourceSystem: "proof-provider" },
  });

  const firstSessionRepository = new PrismaImportSessionRepository();
  const firstCheckpointRepository = new PrismaImportCheckpointRepository();

  const createdAt = new Date("2026-01-01T00:00:00.000Z");
  const updatedAt = new Date("2026-01-01T00:00:01.000Z");

  const runningSession: ImportSession = {
    id: "proof-import-session",
    externalIdentity: {
      sourceSystem: "proof-provider",
      externalId: "historical-import",
    },
    status: "running",
    counts: {
      discovered: 3,
      processed: 3,
      succeeded: 3,
      failed: 0,
    },
    startedAt: createdAt,
    completedAt: null,
    createdAt,
    updatedAt,
  };

  await firstSessionRepository.save(runningSession);

  await firstCheckpointRepository.save({
    id: "proof-import-checkpoint",
    identity: {
      sourceSystem: "proof-provider",
      externalImportId: "historical-import",
    },
    cursor: { value: "page-2" },
    completed: false,
    updatedAt,
  });

  const resumedSessionRepository = new PrismaImportSessionRepository();
  const resumedCheckpointRepository = new PrismaImportCheckpointRepository();

  const resumedSession =
    await resumedSessionRepository.findByExternalIdentity({
      sourceSystem: "proof-provider",
      externalId: "historical-import",
    });

  const resumedCheckpoint =
    await resumedCheckpointRepository.findByIdentity({
      sourceSystem: "proof-provider",
      externalImportId: "historical-import",
    });

  assert(resumedSession !== null, "Expected session to persist across repository instances.");
  assert(
    resumedSession.status === "running",
    "Expected persisted session to remain running."
  );
  assert(
    resumedSession.counts.processed === 3,
    "Expected persisted session progress to survive restart."
  );

  assert(
    resumedCheckpoint !== null,
    "Expected checkpoint to persist across repository instances."
  );
  assert(
    resumedCheckpoint.cursor?.value === "page-2",
    "Expected checkpoint cursor to survive restart."
  );
  assert(
    resumedCheckpoint.completed === false,
    "Expected checkpoint to remain incomplete before traversal completion."
  );

  await resumedSessionRepository.save({
    ...resumedSession,
    status: "completed",
    completedAt: new Date("2026-01-01T00:00:02.000Z"),
    updatedAt: new Date("2026-01-01T00:00:02.000Z"),
  });

  await resumedCheckpointRepository.save({
    id: resumedCheckpoint.id,
    identity: resumedCheckpoint.identity,
    cursor: resumedCheckpoint.cursor,
    completed: true,
    updatedAt: new Date("2026-01-01T00:00:02.000Z"),
  });

  const completedSession = await resumedSessionRepository.find(
    "proof-import-session"
  );
  const completedCheckpoint = await resumedCheckpointRepository.find(
    "proof-import-checkpoint"
  );

  assert(completedSession?.status === "completed", "Expected completed session to persist.");
  assert(
    completedCheckpoint?.completed === true,
    "Expected completed checkpoint to persist."
  );

  console.log("Durable import state proof passed.");
  console.log(
    JSON.stringify(
      {
        resumedSession: true,
        resumedCheckpoint: true,
        persistedCursor: completedCheckpoint.cursor,
        completedCheckpoint: completedCheckpoint.completed,
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
