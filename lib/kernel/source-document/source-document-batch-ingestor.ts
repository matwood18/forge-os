// lib/kernel/source-document/source-document-batch-ingestor.ts
import type {
  SourceDocumentBatchIngestorInput,
  SourceDocumentBatchIngestorResult,
} from "./types";

export interface SourceDocumentBatchIngestor {
  ingestBatch(
    input: SourceDocumentBatchIngestorInput
  ): Promise<SourceDocumentBatchIngestorResult>;
}
