// lib/kernel/source-document/index.ts
export type {
  SourceDocument,
  SourceDocumentContent,
  SourceDocumentExternalIdentity,
  SourceDocumentKind,
  SourceDocumentParticipant,
} from "./types";

export type { SourceDocumentRepository } from "./source-document-repository";

export { InMemorySourceDocumentRepository } from "./in-memory-source-document-repository";