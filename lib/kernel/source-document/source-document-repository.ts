// lib/kernel/source-document/source-document-repository.ts
import type { SourceDocument } from "./types";

export interface SourceDocumentRepository {
  save(document: SourceDocument): Promise<SourceDocument>;
  list(): Promise<SourceDocument[]>;
  find(id: string): Promise<SourceDocument | null>;
}