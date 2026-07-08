// lib/kernel/source-document/source-document-ingestor.ts
import type {
  SourceDocumentIngestorInput,
  SourceDocumentIngestorResult,
} from "./types";

export interface SourceDocumentIngestor {
  ingest(
    input: SourceDocumentIngestorInput
  ): Promise<SourceDocumentIngestorResult>;
}
