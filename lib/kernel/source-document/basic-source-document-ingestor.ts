// lib/kernel/source-document/basic-source-document-ingestor.ts
import type { SourceDocumentRepository } from "./source-document-repository";
import type { SourceDocumentIngestor } from "./source-document-ingestor";
import type {
  SourceDocument,
  SourceDocumentIngestorInput,
  SourceDocumentIngestorResult,
} from "./types";

export class BasicSourceDocumentIngestor implements SourceDocumentIngestor {
  constructor(private readonly repository: SourceDocumentRepository) {}

  async ingest(
    input: SourceDocumentIngestorInput
  ): Promise<SourceDocumentIngestorResult> {
    const existingDocument = await this.repository.findByExternalIdentity({
      sourceSystem: input.document.externalIdentity.sourceSystem,
      externalId: input.document.externalIdentity.externalId,
    });

    const document =
      existingDocument ?? (await this.repository.save(input.document));

    return {
      document,
      eventInput: this.toEventInput(document),
      status: existingDocument ? "existing" : "created",
    };
  }

  private toEventInput(document: SourceDocument) {
    return {
      source: document.externalIdentity.sourceSystem,
      type: `source_document.${document.kind}`,
      occurredAt: document.occurredAt,
      payload: {
        sourceDocumentId: document.id,
        externalIdentity: document.externalIdentity,
        participants: document.participants,
        content: document.content,
      },
    };
  }
}
