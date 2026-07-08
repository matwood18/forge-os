// lib/kernel/entity-mention/entity-mention-extractor.ts
import type {
  EntityMentionExtractorInput,
  EntityMentionExtractorResult,
} from "./types";

export interface EntityMentionExtractor {
  extract(
    input: EntityMentionExtractorInput
  ): Promise<EntityMentionExtractorResult>;
}