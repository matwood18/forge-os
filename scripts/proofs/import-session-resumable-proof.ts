// scripts/proofs/import-session-resumable-proof.ts
import {
  BasicImportSessionEngine,
  InMemoryImportSessionRepository,
} from "@/lib/kernel/import-session";

async function expectFailure(
  operation: () => Promise<unknown>,
  expectedMessage: string
): Promise<void> {
  try {
    await operation();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(expectedMessage)
    ) {
      return;
    }

    throw error;
  }

  throw new Error(`Expected failure containing: ${expectedMessage}`);
}

async function runProof() {
  const repository = new InMemoryImportSessionRepository();
  const engine = new BasicImportSessionEngine(repository);

  const session = await engine.create({
    id: "session-resumable-proof",
    externalIdentity: {
      sourceSystem: "fake-history",
      externalId: "historical-import-1",
    },
    discovered: 0,
    createdAt: new Date("2026-07-08T20:00:00.000Z"),
  });

  await engine.start(session.id);

  await engine.recordDiscovery({
    sessionId: session.id,
    discovered: 3,
  });

  await engine.recordProgress({
    sessionId: session.id,
    processed: 2,
    succeeded: 2,
    failed: 0,
  });

  const afterFirstBatch = await repository.find(session.id);

  if (!afterFirstBatch || afterFirstBatch.status !== "running") {
    throw new Error("Session must remain running after a partial batch.");
  }

  if (
    afterFirstBatch.counts.discovered !== 3 ||
    afterFirstBatch.counts.processed !== 2
  ) {
    throw new Error("First bounded batch counts were not preserved.");
  }

  await engine.recordDiscovery({
    sessionId: session.id,
    discovered: 2,
  });

  await engine.recordProgress({
    sessionId: session.id,
    processed: 2,
    succeeded: 1,
    failed: 1,
  });

  await engine.recordProgress({
    sessionId: session.id,
    processed: 1,
    succeeded: 1,
    failed: 0,
  });

  const completed = await engine.complete({
    sessionId: session.id,
    completedAt: new Date("2026-07-08T21:00:00.000Z"),
  });

  if (completed.status !== "completed_with_failures") {
    throw new Error(
      "Session with item failures must complete with failures."
    );
  }

  if (
    completed.counts.discovered !== 5 ||
    completed.counts.processed !== 5 ||
    completed.counts.succeeded !== 4 ||
    completed.counts.failed !== 1
  ) {
    throw new Error("Final incremental counts are incorrect.");
  }

  await expectFailure(
    () => engine.start(session.id),
    "terminal and cannot be mutated"
  );

  await expectFailure(
    () =>
      engine.recordProgress({
        sessionId: session.id,
        processed: 0,
        succeeded: 0,
        failed: 0,
      }),
    "not running"
  );

  const failureSession = await engine.create({
    id: "session-failure-proof",
    externalIdentity: {
      sourceSystem: "fake-history",
      externalId: "historical-import-2",
    },
    discovered: 0,
  });

  await engine.start(failureSession.id);

  const failed = await engine.fail({
    sessionId: failureSession.id,
    failedAt: new Date("2026-07-08T21:30:00.000Z"),
  });

  if (failed.status !== "failed") {
    throw new Error("Explicit session failure was not preserved.");
  }

  console.log("Resumable import session proof passed.");
  console.log(
    JSON.stringify(
      {
        status: completed.status,
        counts: completed.counts,
        remainedRunningAcrossBatches: true,
        terminalMutationRejected: true,
        explicitFailureSupported: true,
      },
      null,
      2
    )
  );
}

runProof().catch((error) => {
  console.error(error);
  process.exit(1);
});
