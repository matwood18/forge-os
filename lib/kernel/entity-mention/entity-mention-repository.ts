// lib/kernel/entity-mention/entity-mention-repository.ts
import type { EntityMentionExtractionRecord } from "./types";

export interface EntityMentionRepository {
  remember(record: EntityMentionExtractionRecord): Promise<void>;
  list(): Promise<EntityMentionExtractionRecord[]>;
}