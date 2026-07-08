import { BasicImportBoundaryPolicy } from "@/lib/kernel/import-boundary";

function assert(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  const policy =
    new BasicImportBoundaryPolicy({
      maxDiscoveryPages: 5,
      maxRecordsPerPage: 100,
      maxProcessingBatchSize: 25,
    });

  const decision = policy.evaluate({
    discoveredPages: 2,
    pendingRecords: 100,
  });

  assert(
    decision.allowed,
    "Expected bounded work to be allowed."
  );

  assert(
    decision.discoveryPagesRemaining === 3,
    "Expected remaining discovery pages."
  );

  assert(
    decision.processingBatchSize === 25,
    "Expected processing batch cap."
  );

  const exhausted = policy.evaluate({
    discoveredPages: 5,
    pendingRecords: 10,
  });

  assert(
    !exhausted.allowed,
    "Expected exhausted discovery boundary to stop work."
  );

  console.log("Import boundary proof passed.");
  console.log(
    JSON.stringify(
      {
        boundedDiscovery: true,
        boundedProcessing: true,
        exhaustionHandled: true,
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
