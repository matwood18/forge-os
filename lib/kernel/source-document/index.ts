// lib/kernel/source-document/index.ts
export type {
  SourceDocument,
  SourceDocumentContent,
  SourceDocumentExternalIdentity,
  SourceDocumentIngestorInput,
  SourceDocumentBatchIngestorInput,
  SourceDocumentBatchIngestorItemResult,
  SourceDocumentBatchIngestorResult,
  SourceDocumentIngestorResult,
  SourceDocumentIngestorStatus,
  SourceDocumentKind,
  SourceDocumentParticipant,
  SourceDocumentProcessingBatchItemResult,
  SourceDocumentProcessingBatchResult,
} from "./types";

export type { SourceDocumentRepository } from "./source-document-repository";
export type { SourceDocumentIngestor } from "./source-document-ingestor";
export type { SourceDocumentBatchIngestor } from "./source-document-batch-ingestor";

export { InMemorySourceDocumentRepository } from "./in-memory-source-document-repository";
export { BasicSourceDocumentIngestor } from "./basic-source-document-ingestor";
export { BasicSourceDocumentBatchIngestor } from "./basic-source-document-batch-ingestor";
