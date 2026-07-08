// lib/kernel/import-provider/source-document-mapper.ts
import type { SourceDocument } from "@/lib/kernel/source-document";
import type { SourceDocumentMappingInput } from "./types";

export type SourceDocumentMapper = {
  map(input: SourceDocumentMappingInput): SourceDocument;
};

export class DeterministicSourceDocumentMapper implements SourceDocumentMapper {
  map(input: SourceDocumentMappingInput): SourceDocument {
    const { record } = input;
    const { identity } = record;

    return {
      id: [
        "source-document",
        identity.sourceSystem,
        identity.externalId,
      ].join(":"),
      kind: record.kind,
      externalIdentity: {
        sourceSystem: identity.sourceSystem,
        externalId: identity.externalId,
        threadId: identity.threadId,
        conversationId: identity.conversationId,
      },
      participants: record.participants.map((participant) => ({ ...participant })),
      content: { ...record.content },
      occurredAt: record.occurredAt,
      importedAt: record.importedAt,
    };
  }
}
