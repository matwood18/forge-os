import { prisma } from "@/lib/infrastructure/prisma/client";
import { PrismaImportCancellationRepository } from "@/lib/infrastructure/import-cancellation/prisma-import-cancellation-repository";
import { BasicImportCancellationEngine } from "@/lib/kernel/import-cancellation";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  await prisma.importCancellation.deleteMany({
    where: {
      sourceSystem: "proof-provider",
    },
  });

  const engine = new BasicImportCancellationEngine(
    new PrismaImportCancellationRepository()
  );

  const identity = {
    sourceSystem: "proof-provider",
    externalImportId: "historical-import",
  };

  await engine.requestCancellation({
    identity,
    reason: "operator requested stop",
    now: new Date("2026-01-01T00:00:00.000Z"),
  });

  assert(
    await engine.isCancellationRequested(identity),
    "Expected cancellation request to be visible."
  );

  await engine.markCancelled(
    identity,
    new Date("2026-01-01T00:01:00.000Z")
  );

  const record =
    await new PrismaImportCancellationRepository()
      .findByIdentity(identity);

  assert(record !== null, "Expected cancellation record.");
  assert(record.cancelledAt !== null, "Expected cancelled timestamp.");
  assert(
    record.reason === "operator requested stop",
    "Expected reason preservation."
  );

  console.log("Import cancellation proof passed.");
  console.log(
    JSON.stringify(
      {
        requested: true,
        cancelled: true,
        reasonPreserved: true,
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
