// scripts/proofs/import-provider-execution-proof.ts
import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import {
  type ExternalSourceRecord,
  type ImportCursor,
  type ImportProviderAdapter,
} from "@/lib/kernel/import-provider";

class FakePagedImportProviderAdapter implements ImportProviderAdapter {
  constructor(
    private readonly records: ExternalSourceRecord[],
    private readonly failAtOffset: number | null = null
  ) {}

  async discover(request: {
    sourceSystem: string;
    cursor: ImportCursor | null;
    limit: number;
  }) {
    const offset = request.cursor ? Number(request.cursor.value) : 0;

    if (this.failAtOffset === offset) {
      throw new Error("Simulated provider interruption.");
    }

    const matchingRecords = this.records.filter(
      (record) => record.identity.sourceSystem === request.sourceSystem
    );

    const records = matchingRecords.slice(offset, offset + request.limit);
    const nextOffset = offset + records.length;
    const hasMore = nextOffset < matchingRecords.length;

    return {
      records,
      nextCursor: hasMore ? { value: String(nextOffset) } : null,
      hasMore,
    };
  }
}

function createRecord(index: number): ExternalSourceRecord {
  return {
    identity: {
      sourceSystem: "fake-history",
      externalId: `message-${index}`,
      threadId: `thread-${Math.ceil(index / 2)}`,
      conversationId: "conversation-1",
    },
    kind: "chat_message",
    participants: [],
    content: {
      text: `Historical message ${index}`,
      contentType: "text/plain",
    },
    occurredAt: new Date(`2026-07-0${index}T12:00:00.000Z`),
    importedAt: new Date("2026-07-08T20:30:00.000Z"),
  };
}

async function runProof() {
  const kernel = new ForgeKernel();
  const records = Array.from({ length: 5 }, (_, index) =>
    createRecord(index + 1)
  );

  const commonInput = {
    sessionId: "provider-session-1",
    externalIdentity: {
      sourceSystem: "fake-history",
      externalId: "history-import-1",
    },
    checkpointId: "provider-checkpoint-1",
    checkpointIdentity: {
      sourceSystem: "fake-history",
      externalImportId: "history-import-1",
    },
    batchPlan: {
      discoveryLimit: 2,
      processingLimit: 2,
    },
  };

  try {
    await kernel.importFromProvider({
      ...commonInput,
      adapter: new FakePagedImportProviderAdapter(records, 2),
    });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== "Simulated provider interruption."
    ) {
      throw error;
    }
  }

  const interruptedSessions = await kernel.importSessions();
  const interruptedSession = interruptedSessions.find(
    (session) => session.id === commonInput.sessionId
  );

  if (interruptedSession?.status !== "failed") {
    throw new Error("Interrupted provider import must fail its session.");
  }

  const resumed = await kernel.importFromProvider({
    ...commonInput,
    sessionId: "provider-session-2",
    externalIdentity: {
      sourceSystem: "fake-history",
      externalId: "history-import-2",
    },
    adapter: new FakePagedImportProviderAdapter(records),
    completedAt: new Date("2026-07-08T22:00:00.000Z"),
  });

  if (!resumed.checkpoint.completed) {
    throw new Error("Resumed provider import did not complete checkpoint.");
  }

  if (resumed.session.status !== "completed") {
    throw new Error("Resumed provider import did not complete session.");
  }

  if (
    resumed.session.counts.discovered !== 3 ||
    resumed.session.counts.processed !== 3 ||
    resumed.session.counts.succeeded !== 3 ||
    resumed.session.counts.failed !== 0
  ) {
    throw new Error("Resumed session counts are incorrect.");
  }

  const sourceDocuments = await kernel.sourceDocuments();

  if (sourceDocuments.length !== 5) {
    throw new Error("Provider import did not preserve all source documents.");
  }

  const rerun = await kernel.importFromProvider({
    ...commonInput,
    sessionId: resumed.session.id,
    externalIdentity: resumed.session.externalIdentity,
    adapter: new FakePagedImportProviderAdapter(records),
  });

  if (rerun.orchestration.documentsMapped !== 0) {
    throw new Error("Completed provider import rerun must be a no-op.");
  }

  console.log("Import provider execution proof passed.");
  console.log(
    JSON.stringify(
      {
        interruptionFailedSession: true,
        checkpointPreservedSafeCursor: true,
        resumedDocumentCount: resumed.session.counts.processed,
        totalSourceDocuments: sourceDocuments.length,
        completedCheckpoint: resumed.checkpoint.completed,
        completedRerunNoOp: true,
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
