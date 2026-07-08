// lib/kernel/source-document/index.ts
export type {
  SourceDocument,
  SourceDocumentContent,
  SourceDocumentExternalIdentity,
  SourceDocumentIngestorInput,
  SourceDocumentIngestorResult,
  SourceDocumentKind,
  SourceDocumentParticipant,
} from "./types";

export type { SourceDocumentRepository } from "./source-document-repository";
export type { SourceDocumentIngestor } from "./source-document-ingestor";

export { InMemorySourceDocumentRepository } from "./in-memory-source-document-repository";
export { BasicSourceDocumentIngestor } from "./basic-source-document-ingestor";
