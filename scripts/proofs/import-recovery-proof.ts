import { BasicImportRecoveryEngine } from "@/lib/kernel/import-recovery";

function assert(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  const engine = new BasicImportRecoveryEngine();

  const interrupted = engine.evaluate({
    status: "running",
    checkpointExists: true,
    checkpointCompleted: false,
    cancellationRequested: false,
    leaseActive: false,
  });

  assert(
    interrupted.resumable,
    "Expected interrupted import to resume."
  );

  assert(
    interrupted.requiresOwnership,
    "Expected resume to require ownership."
  );

  const cancelled = engine.evaluate({
    status: "running",
    checkpointExists: true,
    checkpointCompleted: false,
    cancellationRequested: true,
    leaseActive: false,
  });

  assert(
    !cancelled.resumable,
    "Expected cancellation to block resume."
  );

  const completed = engine.evaluate({
    status: "completed",
    checkpointExists: true,
    checkpointCompleted: true,
    cancellationRequested: false,
    leaseActive: false,
  });

  assert(
    !completed.resumable,
    "Expected completed imports to remain closed."
  );

  console.log("Import recovery proof passed.");
  console.log(
    JSON.stringify(
      {
        interruptedResume: interrupted.resumable,
        cancellationBlocksResume: !cancelled.resumable,
        completedBlocked: !completed.resumable,
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
