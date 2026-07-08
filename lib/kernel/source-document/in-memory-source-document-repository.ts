// lib/kernel/source-document/in-memory-source-document-repository.ts
import type { SourceDocumentRepository } from "./source-document-repository";
import type { SourceDocument } from "./types";

export class InMemorySourceDocumentRepository
  implements SourceDocumentRepository
{
  private readonly documents: SourceDocument[] = [];

  async save(document: SourceDocument): Promise<SourceDocument> {
    this.documents.push(document);

    return document;
  }

  async list(): Promise<SourceDocument[]> {
    return [...this.documents];
  }

  async find(id: string): Promise<SourceDocument | null> {
    return this.documents.find((document) => document.id === id) ?? null;
  }
}