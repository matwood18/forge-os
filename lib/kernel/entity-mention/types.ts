// lib/kernel/entity-mention/types.ts
import type { InterpretationRecord } from "@/lib/kernel/interpretation";

export type EntityMentionKind =
  | "person_name"
  | "current_operator"
  | "pronoun"
  | "organization"
  | "task_or_obligation"
  | "unknown";

export type MentionedEntityRole =
  | "subject"
  | "object"
  | "actor"
  | "recipient"
  | "related_party"
  | "unknown";

export type EntityMentionResolutionHint = {
  kind: EntityMentionKind;
  normalizedText: string;
  confidence: number;
};

export type EntityMentionSource = {
  interpretationId: string;
  input: string;
};

export type EntityMention = {
  id: string;
  extractionId: string;
  text: string;
  normalizedText: string;
  kind: EntityMentionKind;
  role: MentionedEntityRole;
  startOffset: number;
  endOffset: number;
  confidence: number;
  resolutionHints: EntityMentionResolutionHint[];
};

export type EntityMentionExtractionRecord = {
  id: string;
  interpretationId: string;
  source: EntityMentionSource;
  mentions: EntityMention[];
  extractedAt: Date;
};

export type EntityMentionExtractorInput = {
  interpretation: InterpretationRecord;
};

export type EntityMentionExtractorResult = {
  record: EntityMentionExtractionRecord;
};