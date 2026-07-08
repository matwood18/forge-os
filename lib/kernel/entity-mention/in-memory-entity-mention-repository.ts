// lib/kernel/entity-mention/in-memory-entity-mention-repository.ts
import type { EntityMentionRepository } from "./entity-mention-repository";
import type { EntityMentionExtractionRecord } from "./types";

export class InMemoryEntityMentionRepository
  implements EntityMentionRepository
{
  private readonly records: EntityMentionExtractionRecord[] = [];

  async remember(record: EntityMentionExtractionRecord): Promise<void> {
    this.records.push(record);
  }

  async list(): Promise<EntityMentionExtractionRecord[]> {
    return [...this.records];
  }
}