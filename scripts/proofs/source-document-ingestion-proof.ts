// scripts/proofs/source-document-ingestion-proof.ts
import assert from "node:assert/strict";

import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import type { SourceDocument } from "@/lib/kernel/source-document";

async function main() {
  const kernel = new ForgeKernel();

  const document: SourceDocument = {
    id: "proof-source-document-1",
    kind: "text_message",
    externalIdentity: {
      sourceSystem: "proof.sms",
      externalId: "sms-thread-1-message-1",
      threadId: "sms-thread-1",
      conversationId: "jess-thread",
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
      text: "Jess is mad at me for not contacting insurance.",
      contentType: "text/plain",
    },
    occurredAt: new Date("2026-07-08T12:00:00.000Z"),
    importedAt: new Date("2026-07-08T12:01:00.000Z"),
  };

  const firstResult = await kernel.ingestSourceDocument(document);
  const secondResult = await kernel.ingestSourceDocument(document);

  assert.equal(
    firstResult.event.id,
    secondResult.event.id,
    "Duplicate source document ingestion should return the existing event."
  );

  const sourceDocuments = await kernel.sourceDocuments();
  const events = await kernel.events();
  const interpretations = await kernel.interpretations();
  const semanticClaims = await kernel.semanticClaims();
  const semanticClaimRelations = await kernel.semanticClaimRelations();

  assert.equal(sourceDocuments.length, 1, "Expected one source document.");
  assert.equal(events.length, 1, "Expected one event.");
  assert.equal(interpretations.length, 1, "Expected one interpretation.");

  assert.ok(
    semanticClaims.some(
      (claim) =>
        claim.subject === "current_operator" &&
        claim.predicate === "has_possible_obligation" &&
        claim.object === "contacting insurance"
    ),
    "Expected source-document ingestion to generate an obligation claim."
  );

  assert.ok(
    semanticClaims.some(
      (claim) =>
        claim.subject === "jess" &&
        claim.predicate === "expresses_possible_emotion" &&
        claim.object === "mad"
    ),
    "Expected source-document ingestion to generate a subject-associated emotion claim."
  );

  assert.ok(
    semanticClaimRelations.some(
      (relation) => relation.kind === "may_be_related_to"
    ),
    "Expected source-document ingestion to generate a semantic claim relation."
  );

  console.log("✓ Source document ingestion proof passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
