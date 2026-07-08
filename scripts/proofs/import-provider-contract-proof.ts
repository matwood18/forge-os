// scripts/proofs/import-provider-contract-proof.ts
import {
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
    if (request.limit < 1) {
      throw new Error("Discovery limit must be positive.");
    }

    const offset = request.cursor ? Number(request.cursor.value) : 0;

    if (!Number.isInteger(offset) || offset < 0) {
      throw new Error("Cursor must resolve to a non-negative integer offset.");
    }

    const providerRecords = this.records.filter(
      (record) => record.identity.sourceSystem === request.sourceSystem,
    );

    const pageRecords = providerRecords.slice(offset, offset + request.limit);
    const nextOffset = offset + pageRecords.length;
    const hasMore = nextOffset < providerRecords.length;

    return {
      records: pageRecords,
      nextCursor: hasMore ? { value: String(nextOffset) } : null,
      hasMore,
    };
  }
}

const importedAt = new Date("2026-07-08T20:30:00.000Z");

const records: ExternalSourceRecord[] = [
  {
    identity: {
      sourceSystem: "fake-mail",
      externalId: "message-1",
      threadId: "thread-a",
      conversationId: "conversation-a",
    },
    kind: "email",
    participants: [
      {
        id: "person-a",
        displayName: "Madison",
        address: "madison@example.test",
        role: "author",
      },
      {
        id: "person-b",
        displayName: "Jess",
        address: "jess@example.test",
        role: "recipient",
      },
    ],
    content: {
      text: "Can you call insurance today?",
      contentType: "text/plain",
    },
    occurredAt: new Date("2026-07-07T14:00:00.000Z"),
    importedAt,
  },
  {
    identity: {
      sourceSystem: "fake-mail",
      externalId: "message-2",
      threadId: "thread-a",
      conversationId: "conversation-a",
    },
    kind: "email",
    participants: [
      {
        id: "person-b",
        displayName: "Jess",
        address: "jess@example.test",
        role: "author",
      },
      {
        id: "person-a",
        displayName: "Madison",
        address: "madison@example.test",
        role: "recipient",
      },
    ],
    content: {
      text: "I am frustrated that insurance has not been contacted.",
      contentType: "text/plain",
    },
    occurredAt: new Date("2026-07-07T14:05:00.000Z"),
    importedAt,
  },
  {
    identity: {
      sourceSystem: "fake-mail",
      externalId: "message-3",
      threadId: "thread-b",
      conversationId: "conversation-b",
    },
    kind: "email",
    participants: [
      {
        id: "person-a",
        displayName: "Madison",
        address: "madison@example.test",
        role: "author",
      },
    ],
    content: {
      text: "Manual follow-up note from provider export.",
      contentType: "text/plain",
    },
    occurredAt: new Date("2026-07-07T15:00:00.000Z"),
    importedAt,
  },
];

async function runProof() {
  const adapter = new FakePagedImportProviderAdapter(records);
  const mapper = new DeterministicSourceDocumentMapper();

  let cursor: ImportCursor | null = null;
  let pagesDiscovered = 0;
  const documents = [];

  do {
    const page = await adapter.discover({
      sourceSystem: "fake-mail",
      cursor,
      limit: 2,
    });

    pagesDiscovered += 1;
    documents.push(...page.records.map((record) => mapper.map({ record })));
    cursor = page.nextCursor;
  } while (cursor);

  const remappedDocuments = records.map((record) => mapper.map({ record }));

  const stableDocumentIds = documents.every(
    (document, index) => document.id === remappedDocuments[index]?.id,
  );

  const boundedDiscovery = pagesDiscovered === 2 && documents.length === 3;

  if (!stableDocumentIds) {
    throw new Error("SourceDocument mapping did not produce stable IDs.");
  }

  if (!boundedDiscovery) {
    throw new Error("Provider discovery did not respect bounded pagination.");
  }

  console.log("Import provider contract proof passed.");
  console.log(
    JSON.stringify(
      {
        pagesDiscovered,
        documentsMapped: documents.length,
        stableDocumentIds,
        boundedDiscovery,
      },
      null,
      2,
    ),
  );
}

runProof().catch((error) => {
  console.error(error);
  process.exit(1);
});
