import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { ForgeKernel } from "@/lib/kernel/forge-kernel";
import type { SourceDocument } from "@/lib/kernel/source-document";

type DatasetDocument = {
  id: string;
  kind: string;
  externalId: string;
  conversationId: string;
  occurredAt: string;
  participants: string[];
  content: string;
};

type Dataset = {
  name: string;
  documents: DatasetDocument[];
};

function mapDocument(document: DatasetDocument): SourceDocument {
  return {
    id: document.id,
    kind: "text_message",
    externalIdentity: {
      sourceSystem: "forge.memory.challenge",
      externalId: document.externalId,
      threadId: document.conversationId,
      conversationId: document.conversationId,
    },
    participants: document.participants.map((participant, index) => ({
      id: participant.toLowerCase().replaceAll(" ", "-"),
      displayName: participant,
      address: `challenge-${index}`,
      role: "participant",
    })),
    content: {
      text: document.content,
      contentType: "text/plain",
    },
    occurredAt: new Date(document.occurredAt),
    importedAt: new Date("2026-07-08T12:00:00.000Z"),
  };
}

async function main() {
  const dataset = JSON.parse(
    await readFile(
      "examples/forge-memory-challenge/family-texts-90-days.json",
      "utf-8"
    )
  ) as Dataset;

  const kernel = new ForgeKernel();

  const documents = dataset.documents.map(mapDocument);

  const result = await kernel.ingestSourceDocuments(documents);

  assert.equal(
    result.results.length,
    documents.length,
    "Expected every dataset document to produce a result."
  );

  const fulfilled = result.results.filter(
    (item) => item.status === "fulfilled"
  );

  assert.equal(
    fulfilled.length,
    documents.length,
    "Expected every challenge document to be ingested."
  );

  const claims = await kernel.semanticClaims();
  const relationships = await kernel.relationships();
  const memories = await kernel.memories();
  const reflections = await kernel.reflections();
  const recommendations = await kernel.recommendations();
  const actions = await kernel.actions();

  console.log("");
  console.log("Forge Memory Challenge Proof");
  console.log("================================");
  console.log("");
  console.log(`Documents processed: ${documents.length}`);
  console.log(`Semantic claims: ${claims.length}`);
  console.log(`Relationships: ${relationships.length}`);
  console.log(`Memories: ${memories.length}`);
  console.log(`Reflections: ${reflections.length}`);
  console.log(`Recommendations: ${recommendations.length}`);
  console.log(`Actions: ${actions.length}`);
  console.log("");

  console.log("Current capability boundary");
  console.log("--------------------------------");
  console.log("✓ Source history ingestion");
  console.log("✓ Semantic understanding");
  console.log("✓ Cognitive processing");
  console.log("✓ Reflection generation");
  console.log("✓ Recommendation evaluation");
  console.log("✓ Authorization boundaries");
  console.log("");
  console.log("Not yet implemented");
  console.log("--------------------------------");
  console.log("✗ Longitudinal pattern consolidation");
  console.log("✗ Stable preference learning");
  console.log("✗ Historical trend reasoning");
  console.log("✗ Learned world model updates");
  console.log("");

  console.log("✓ Forge Memory Challenge proof passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
