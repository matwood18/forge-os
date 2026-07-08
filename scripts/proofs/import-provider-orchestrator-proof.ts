// scripts/proofs/import-provider-orchestrator-proof.ts
import type { SourceDocument } from "@/lib/kernel/source-document";
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
      threadId: `thread-${Math.ceil(index / 2)}`,
      conversationId: "conversation-1",
    },
    kind: "chat_message",
    participants: [
      {
        id: "person-1",
        displayName: "Person One",
        address: null,
        role: "author",
      },
    ],
    content: {
      text: `Historical message ${index}`,
      contentType: "text/plain",
    },
    occurredAt: new Date(`2026-07-0${index}T12:00:00.000Z`),
    importedAt: new Date("2026-07-08T20:30:00.000Z"),
  };
}

async function runProof() {
  const records = Array.from({ length: 7 }, (_, index) =>
    createRecord(index + 1)
  );

  const processedBatches: SourceDocument[][] = [];

  const orchestrator = new BasicImportProviderOrchestrator(
    new FakePagedImportProviderAdapter(records),
    new DeterministicSourceDocumentMapper()
  );

  const result = await orchestrator.run({
    sourceSystem: "fake-history",
    initialCursor: null,
    batchPlan: {
      discoveryLimit: 3,
      processingLimit: 2,
    },
    processPage: async (documents) => {
      processedBatches.push(documents);
    },
  });

  const processedDocuments = processedBatches.flat();

  const expectedBatchSizes = [2, 1, 2, 1, 1];
  const actualBatchSizes = processedBatches.map((batch) => batch.length);

  if (result.pagesDiscovered !== 3) {
    throw new Error("Expected exactly three provider discovery pages.");
  }

  if (result.recordsDiscovered !== 7 || result.documentsMapped !== 7) {
    throw new Error("Expected all seven records to be discovered and mapped.");
  }

  if (
    JSON.stringify(actualBatchSizes) !== JSON.stringify(expectedBatchSizes)
  ) {
    throw new Error(
      `Unexpected processing batch sizes: ${JSON.stringify(actualBatchSizes)}`
    );
  }

  if (processedDocuments.length !== 7) {
    throw new Error("Expected all mapped documents to be processed.");
  }

  const expectedIds = records.map(
    (record) =>
      `source-document:${record.identity.sourceSystem}:${record.identity.externalId}`
  );

  const actualIds = processedDocuments.map((document) => document.id);

  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    throw new Error("Document order or deterministic identity was not preserved.");
  }

  if (result.finalCursor !== null) {
    throw new Error("Completed traversal must return a null final cursor.");
  }

  console.log("Import provider orchestrator proof passed.");
  console.log(
    JSON.stringify(
      {
        pagesDiscovered: result.pagesDiscovered,
        recordsDiscovered: result.recordsDiscovered,
        documentsMapped: result.documentsMapped,
        processingBatchSizes: actualBatchSizes,
        orderPreserved: true,
        deterministicIdentityPreserved: true,
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
