import { ImportStatusBuilder } from "@/lib/demo/import-status";
import { InMemoryImportSessionRepository } from "@/lib/kernel/import-session/in-memory-import-session-repository";
import { InMemoryImportCheckpointRepository } from "@/lib/kernel/import-checkpoint/in-memory-import-checkpoint-repository";
import { InMemoryImportLeaseRepository } from "@/lib/kernel/import-lease/in-memory-import-lease-repository";
import { InMemoryImportCancellationRepository } from "@/lib/kernel/import-cancellation/in-memory-import-cancellation-repository";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  const identity = {
    sourceSystem: "proof-provider",
    externalImportId: "historical-import",
  };

  const sessions = new InMemoryImportSessionRepository();
  const checkpoints = new InMemoryImportCheckpointRepository();
  const leases = new InMemoryImportLeaseRepository();
  const cancellations = new InMemoryImportCancellationRepository();

  await sessions.save({
    id: "session-1",
    externalIdentity: {
      sourceSystem: identity.sourceSystem,
      externalId: identity.externalImportId,
    },
    status: "running",
    counts: {
      discovered: 10,
      processed: 5,
      succeeded: 5,
      failed: 0,
    },
    startedAt: new Date(),
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await checkpoints.save({
    id: "checkpoint-1",
    identity,
    cursor: { value: "page-5" },
    completed: false,
  });

  const projection =
    await new ImportStatusBuilder(
      sessions,
      checkpoints,
      leases,
      cancellations
    ).build(identity);

  assert(projection !== null, "Expected projection.");
  assert(
    projection.counts.processed === 5,
    "Expected progress projection."
  );
  assert(
    projection.checkpoint?.completed === false,
    "Expected incomplete checkpoint."
  );
  assert(
    projection.resumable,
    "Expected resumable state."
  );

  console.log("Import status projection proof passed.");
  console.log(
    JSON.stringify(
      {
        lifecycle: projection.lifecycle,
        processed: projection.counts.processed,
        resumable: projection.resumable,
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
