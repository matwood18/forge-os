// lib/kernel/entity-mention/index.ts
export type { EntityMentionExtractor } from "./entity-mention-extractor";
export type { EntityMentionRepository } from "./entity-mention-repository";

export { BasicEntityMentionExtractor } from "./basic-entity-mention-extractor";
export { InMemoryEntityMentionRepository } from "./in-memory-entity-mention-repository";

export type {
  EntityMention,
  EntityMentionExtractionRecord,
  EntityMentionExtractorInput,
  EntityMentionExtractorResult,
  EntityMentionKind,
  EntityMentionResolutionHint,
  EntityMentionSource,
  MentionedEntityRole,
} from "./types";