// lib/kernel/source-document/basic-source-document-batch-ingestor.ts
import type { SourceDocumentIngestor } from "./source-document-ingestor";
import type { SourceDocumentBatchIngestor } from "./source-document-batch-ingestor";
import type {
  SourceDocumentBatchIngestorInput,
  SourceDocumentBatchIngestorItemResult,
  SourceDocumentBatchIngestorResult,
} from "./types";

export class BasicSourceDocumentBatchIngestor
  implements SourceDocumentBatchIngestor
{
  constructor(private readonly sourceDocumentIngestor: SourceDocumentIngestor) {}

  async ingestBatch(
    input: SourceDocumentBatchIngestorInput
  ): Promise<SourceDocumentBatchIngestorResult> {
    const results: SourceDocumentBatchIngestorItemResult[] = [];

    for (const document of input.documents) {
      try {
        const result = await this.sourceDocumentIngestor.ingest({
          document,
        });

        results.push({
          status: "fulfilled",
          result,
        });
      } catch (error) {
        results.push({
          status: "rejected",
          document,
          reason:
            error instanceof Error
              ? error.message
              : "Unknown source document ingestion error.",
        });
      }
    }

    return { results };
  }
}
