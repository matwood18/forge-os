// scripts/proofs/source-document-batch-ingestion-proof.ts
import assert from "node:assert/strict";

import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import {
  BasicSourceDocumentBatchIngestor,
  BasicSourceDocumentIngestor,
  InMemorySourceDocumentRepository,
  type SourceDocument,
  type SourceDocumentBatchIngestor,
  type SourceDocumentBatchIngestorInput,
  type SourceDocumentBatchIngestorResult,
} from "@/lib/kernel/source-document";

class RejectingSourceDocumentBatchIngestor
  implements SourceDocumentBatchIngestor
{
  constructor(
    private readonly delegate: SourceDocumentBatchIngestor,
    private readonly rejectedExternalId: string
  ) {}

  async ingestBatch(
    input: SourceDocumentBatchIngestorInput
  ): Promise<SourceDocumentBatchIngestorResult> {
    const acceptedDocuments = input.documents.filter(
      (document) =>
        document.externalIdentity.externalId !== this.rejectedExternalId
    );

    const delegatedResult = await this.delegate.ingestBatch({
      documents: acceptedDocuments,
    });

    const rejectedDocument = input.documents.find(
      (document) =>
        document.externalIdentity.externalId === this.rejectedExternalId
    );

    if (!rejectedDocument) {
      return delegatedResult;
    }

    return {
      results: [
        ...delegatedResult.results,
        {
          status: "rejected",
          document: rejectedDocument,
          reason: "Forced batch ingestion failure.",
        },
      ],
    };
  }
}

function createDocument(input: {
  id: string;
  externalId: string;
  text: string;
  occurredAt: string;
}): SourceDocument {
  return {
    id: input.id,
    kind: "text_message",
    externalIdentity: {
      sourceSystem: "proof.sms",
      externalId: input.externalId,
      threadId: "proof-thread",
      conversationId: "proof-conversation",
    },
    participants: [
      {
        id: "participant-jess",
        displayName: "Jess",
        address: "+15550000001",
        role: "author",
      },
      {
        id: "participant-current-operator",
        displayName: "Current Operator",
        address: "+15550000002",
        role: "recipient",
      },
    ],
    content: {
      text: input.text,
      contentType: "text/plain",
    },
    occurredAt: new Date(input.occurredAt),
    importedAt: new Date("2026-07-08T12:10:00.000Z"),
  };
}

async function main() {
  const repository = new InMemorySourceDocumentRepository();
  const ingestor = new BasicSourceDocumentIngestor(repository);
  const batchIngestor = new RejectingSourceDocumentBatchIngestor(
    new BasicSourceDocumentBatchIngestor(ingestor),
    "forced-failure"
  );

  const kernel = new ForgeKernel({
    sourceDocumentRepository: repository,
    sourceDocumentIngestor: ingestor,
    sourceDocumentBatchIngestor: batchIngestor,
  });

  const firstDocument = createDocument({
    id: "batch-document-1",
    externalId: "message-1",
    text: "Jess is mad at me for not contacting insurance.",
    occurredAt: "2026-07-08T12:00:00.000Z",
  });

  const secondDocument = createDocument({
    id: "batch-document-2",
    externalId: "message-2",
    text: "I need to call the dentist.",
    occurredAt: "2026-07-08T12:01:00.000Z",
  });

  const duplicateDocument = {
    ...firstDocument,
    id: "batch-document-1-duplicate-import",
    importedAt: new Date("2026-07-08T12:11:00.000Z"),
  };

  const rejectedDocument = createDocument({
    id: "batch-document-rejected",
    externalId: "forced-failure",
    text: "This document should be rejected before kernel processing.",
    occurredAt: "2026-07-08T12:02:00.000Z",
  });

  const firstBatch = await kernel.ingestSourceDocuments([
    firstDocument,
    secondDocument,
    duplicateDocument,
    rejectedDocument,
  ]);

  assert.equal(firstBatch.results.length, 4, "Expected four batch results.");

  assert.equal(
    firstBatch.results.filter((item) => item.status === "fulfilled").length,
    3,
    "Expected three fulfilled batch results."
  );

  assert.equal(
    firstBatch.results.filter((item) => item.status === "rejected").length,
    1,
    "Expected one rejected batch result."
  );

  const firstBatchFulfilled = firstBatch.results.filter(
    (item) => item.status === "fulfilled"
  );

  assert.equal(
    firstBatchFulfilled[0]?.result.event.id,
    firstBatchFulfilled[2]?.result.event.id,
    "Duplicate source documents should resolve to the same event."
  );

  assert.equal(
    (await kernel.sourceDocuments()).length,
    2,
    "Expected two unique persisted source documents."
  );

  assert.equal(
    (await kernel.events()).length,
    2,
    "Expected two unique events."
  );

  assert.equal(
    (await kernel.interpretations()).length,
    2,
    "Expected two unique interpretations."
  );

  const semanticClaims = await kernel.semanticClaims();

  assert.ok(
    semanticClaims.some(
      (claim) =>
        claim.subject === "current_operator" &&
        claim.predicate === "has_possible_obligation" &&
        claim.object === "contacting insurance"
    ),
    "Expected the first successful document to generate an obligation claim."
  );

  assert.ok(
    semanticClaims.some(
      (claim) =>
        claim.subject === "current_operator" &&
        claim.predicate === "has_possible_obligation" &&
        claim.object === "call the"
    ),
    "Expected the second successful document to generate an obligation claim."
  );

  const eventIdsBeforeRerun = (await kernel.events())
    .map((event) => event.id)
    .sort();

  const interpretationCountBeforeRerun = (await kernel.interpretations()).length;
  const semanticClaimCountBeforeRerun = (await kernel.semanticClaims()).length;

  const secondBatch = await kernel.ingestSourceDocuments([
    firstDocument,
    secondDocument,
    duplicateDocument,
    rejectedDocument,
  ]);

  assert.equal(secondBatch.results.length, 4, "Expected four rerun results.");

  assert.deepEqual(
    (await kernel.events()).map((event) => event.id).sort(),
    eventIdsBeforeRerun,
    "Rerunning the batch should not create new events."
  );

  assert.equal(
    (await kernel.interpretations()).length,
    interpretationCountBeforeRerun,
    "Rerunning the batch should not create new interpretations."
  );

  assert.equal(
    (await kernel.semanticClaims()).length,
    semanticClaimCountBeforeRerun,
    "Rerunning the batch should not create new semantic claims."
  );

  console.log("✓ Source document batch ingestion proof passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
