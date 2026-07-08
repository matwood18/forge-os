// scripts/proofs/import-checkpoint-proof.ts
import {
  InMemoryImportCheckpointRepository,
} from "@/lib/kernel/import-checkpoint";
import {
  BasicImportProviderOrchestrator,
  DeterministicSourceDocumentMapper,
  type ExternalSourceRecord,
  type ImportCursor,
  type ImportProviderAdapter,
} from "@/lib/kernel/import-provider";

class FakePagedImportProviderAdapter implements ImportProviderAdapter {
  constructor(private readonly records: ExternalSourceRecord[]) {}

  async discover(request: {
    sourceSystem: string;
    cursor: ImportCursor | null;
    limit: number;
  }) {
    const offset = request.cursor ? Number(request.cursor.value) : 0;
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
      threadId: null,
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
  const records = Array.from({ length: 5 }, (_, index) =>
    createRecord(index + 1)
  );

  const repository = new InMemoryImportCheckpointRepository();
  const identity = {
    sourceSystem: "fake-history",
    externalImportId: "history-import-1",
  };

  const firstPageOnly = new BasicImportProviderOrchestrator(
    new FakePagedImportProviderAdapter(records.slice(0, 2)),
    new DeterministicSourceDocumentMapper()
  );

  await firstPageOnly.run({
    sourceSystem: identity.sourceSystem,
    initialCursor: null,
    batchPlan: {
      discoveryLimit: 2,
      processingLimit: 2,
    },
    processPage: async () => {},
    recordCheckpoint: async () => {
      await repository.save({
        id: "checkpoint-1",
        identity,
        cursor: { value: "2" },
        completed: false,
      });
    },
  });

  const interruptedCheckpoint = await repository.findByIdentity(identity);

  if (!interruptedCheckpoint) {
    throw new Error("Checkpoint was not persisted.");
  }

  if (interruptedCheckpoint.cursor?.value !== "2") {
    throw new Error("Checkpoint did not preserve the last safe cursor.");
  }

  const resumedOrchestrator = new BasicImportProviderOrchestrator(
    new FakePagedImportProviderAdapter(records),
    new DeterministicSourceDocumentMapper()
  );

  const resumedDocumentIds: string[] = [];

  await resumedOrchestrator.run({
    sourceSystem: identity.sourceSystem,
    initialCursor: interruptedCheckpoint.cursor,
    batchPlan: {
      discoveryLimit: 2,
      processingLimit: 2,
    },
    processPage: async (documents) => {
      resumedDocumentIds.push(...documents.map((document) => document.id));
    },
    recordCheckpoint: async (cursor) => {
      await repository.save({
        id: interruptedCheckpoint.id,
        identity,
        cursor,
        completed: cursor === null,
      });
    },
  });

  const completedCheckpoint = await repository.findByIdentity(identity);

  if (!completedCheckpoint?.completed) {
    throw new Error("Resumed traversal did not complete the checkpoint.");
  }

  const expectedResumedIds = [
    "source-document:fake-history:message-3",
    "source-document:fake-history:message-4",
    "source-document:fake-history:message-5",
  ];

  if (
    JSON.stringify(resumedDocumentIds) !== JSON.stringify(expectedResumedIds)
  ) {
    throw new Error("Resume did not continue from the persisted cursor.");
  }

  console.log("Import checkpoint proof passed.");
  console.log(
    JSON.stringify(
      {
        interruptedCursor: interruptedCheckpoint.cursor,
        checkpointRepresentsLastSafeBoundary: true,
        resumedDocumentCount: resumedDocumentIds.length,
        completed: completedCheckpoint.completed,
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
