// scripts/proofs/import-session-proof.ts
import assert from "node:assert/strict";

import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import type { SourceDocument } from "@/lib/kernel/source-document";

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
    importedAt: new Date("2026-07-08T12:30:00.000Z"),
  };
}

async function main() {
  const kernel = new ForgeKernel();

  const documents = [
    createDocument({
      id: "import-session-document-1",
      externalId: "import-message-1",
      text: "Jess is mad at me for not contacting insurance.",
      occurredAt: "2026-07-08T12:00:00.000Z",
    }),
    createDocument({
      id: "import-session-document-2",
      externalId: "import-message-2",
      text: "I need to call the dentist.",
      occurredAt: "2026-07-08T12:01:00.000Z",
    }),
  ];

  const firstImport = await kernel.importSourceDocuments({
    sessionId: "proof-import-session-1",
    externalIdentity: {
      sourceSystem: "proof.sms",
      externalId: "proof-import-window-1",
    },
    documents,
    createdAt: new Date("2026-07-08T12:29:00.000Z"),
    completedAt: new Date("2026-07-08T12:31:00.000Z"),
  });

  assert.equal(firstImport.session.status, "completed");
  assert.deepEqual(firstImport.session.counts, {
    discovered: 2,
    processed: 2,
    succeeded: 2,
    failed: 0,
  });

  assert.equal(firstImport.batch.results.length, 2);
  assert.equal(
    firstImport.batch.results.every((item) => item.status === "fulfilled"),
    true
  );

  assert.equal((await kernel.importSessions()).length, 1);
  assert.equal((await kernel.sourceDocuments()).length, 2);
  assert.equal((await kernel.events()).length, 2);
  assert.equal((await kernel.interpretations()).length, 2);

  const eventIdsBeforeRerun = (await kernel.events())
    .map((event) => event.id)
    .sort();

  const interpretationCountBeforeRerun = (await kernel.interpretations()).length;
  const semanticClaimCountBeforeRerun = (await kernel.semanticClaims()).length;

  const secondImport = await kernel.importSourceDocuments({
    sessionId: "proof-import-session-1-rerun-ignored-by-external-identity",
    externalIdentity: {
      sourceSystem: "proof.sms",
      externalId: "proof-import-window-1",
    },
    documents,
    createdAt: new Date("2026-07-08T12:40:00.000Z"),
    completedAt: new Date("2026-07-08T12:41:00.000Z"),
  });

  assert.equal(
    secondImport.session.id,
    firstImport.session.id,
    "Import session should be reused by external identity."
  );

  assert.deepEqual(
    (await kernel.events()).map((event) => event.id).sort(),
    eventIdsBeforeRerun,
    "Rerunning the import should not create new events."
  );

  assert.equal(
    (await kernel.interpretations()).length,
    interpretationCountBeforeRerun,
    "Rerunning the import should not create new interpretations."
  );

  assert.equal(
    (await kernel.semanticClaims()).length,
    semanticClaimCountBeforeRerun,
    "Rerunning the import should not create new semantic claims."
  );

  console.log("✓ Import session proof passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
