// lib/kernel/entity-mention/basic-entity-mention-extractor.ts

import type { Event } from "@/lib/domain";

import type { EntityMentionExtractor } from "./entity-mention-extractor";
import type {
  EntityMention,
  EntityMentionExtractorInput,
  EntityMentionExtractorResult,
  EntityMentionKind,
  MentionedEntityRole,
} from "./types";

const CURRENT_OPERATOR_TERMS = new Set(["i", "me", "my", "mine", "myself"]);

const PRONOUN_TERMS = new Set([
  "he",
  "him",
  "his",
  "she",
  "her",
  "hers",
  "they",
  "them",
  "their",
  "theirs",
]);

const TASK_TRIGGER_TERMS = new Set([
  "call",
  "calling",
  "contact",
  "contacting",
  "contacted",
  "email",
  "emailing",
  "text",
  "texting",
  "pay",
  "paying",
  "schedule",
  "scheduling",
  "submit",
  "submitting",
]);

const EMOTION_TERMS = new Set([
  "angry",
  "annoyed",
  "frustrated",
  "mad",
  "sad",
  "upset",
  "worried",
]);

const TEMPORAL_TERMS = new Set([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "today",
  "tomorrow",
  "tonight",
  "yesterday",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]);

type TokenMatch = {
  text: string;
  startOffset: number;
  endOffset: number;
};

export class BasicEntityMentionExtractor implements EntityMentionExtractor {
  async extract(
    input: EntityMentionExtractorInput
  ): Promise<EntityMentionExtractorResult> {
    const sourceInput = this.readSourceInput(input.interpretation.sourceEvent);
    const extractionId = crypto.randomUUID();

    const mentions = this.extractMentions(sourceInput, extractionId);

    return {
      record: {
        id: extractionId,
        interpretationId: input.interpretation.id,
        source: {
          interpretationId: input.interpretation.id,
          input: sourceInput,
        },
        mentions,
        extractedAt: new Date(),
      },
    };
  }

  private readSourceInput(sourceEvent: Event): string {
    if (typeof sourceEvent.payload === "string") {
      return sourceEvent.payload;
    }

    if (
      typeof sourceEvent.payload === "object" &&
      sourceEvent.payload !== null &&
      "text" in sourceEvent.payload
    ) {
      const text = sourceEvent.payload.text;

      if (typeof text === "string") {
        return text;
      }
    }

    if (
      typeof sourceEvent.payload === "object" &&
      sourceEvent.payload !== null &&
      "input" in sourceEvent.payload
    ) {
      const input = sourceEvent.payload.input;

      if (typeof input === "string") {
        return input;
      }
    }

    if (
      typeof sourceEvent.payload === "object" &&
      sourceEvent.payload !== null &&
      "content" in sourceEvent.payload &&
      typeof sourceEvent.payload.content === "object" &&
      sourceEvent.payload.content !== null &&
      "text" in sourceEvent.payload.content
    ) {
      const text = sourceEvent.payload.content.text;

      if (typeof text === "string") {
        return text;
      }
    }

    return sourceEvent.source;
  }

  private extractMentions(
    input: string,
    extractionId: string
  ): EntityMention[] {
    const mentions: EntityMention[] = [];

    for (const token of this.tokenize(input)) {
      const normalizedText = this.normalize(token.text);
      const kind = this.classifyToken(token.text, normalizedText);

      if (kind === "unknown") {
        continue;
      }

      mentions.push(
        this.createMention({
          extractionId,
          token,
          kind,
          role: this.inferRole(kind),
          confidence: this.confidenceFor(kind),
        })
      );
    }

    mentions.push(...this.extractTaskMentions(input, extractionId));

    return mentions;
  }

  private tokenize(input: string): TokenMatch[] {
    const matches = input.matchAll(/\b[A-Za-z][A-Za-z']*\b/g);

    return Array.from(matches).map((match) => ({
      text: match[0],
      startOffset: match.index ?? 0,
      endOffset: (match.index ?? 0) + match[0].length,
    }));
  }

  private classifyToken(
    originalText: string,
    normalizedText: string
  ): EntityMentionKind {
    if (CURRENT_OPERATOR_TERMS.has(normalizedText)) {
      return "current_operator";
    }

    if (PRONOUN_TERMS.has(normalizedText)) {
      return "pronoun";
    }

    if (EMOTION_TERMS.has(normalizedText)) {
      return "emotion_expression";
    }

    if (TEMPORAL_TERMS.has(normalizedText)) {
      return "unknown";
    }

    if (this.looksLikePersonName(originalText)) {
      return "person_name";
    }

    return "unknown";
  }

  private looksLikePersonName(text: string): boolean {
    return /^[A-Z][a-z]+$/.test(text);
  }

  private extractTaskMentions(
    input: string,
    extractionId: string
  ): EntityMention[] {
    const mentions: EntityMention[] = [];
    const tokens = this.tokenize(input);

    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index];
      const normalizedText = this.normalize(token.text);

      if (!TASK_TRIGGER_TERMS.has(normalizedText)) {
        continue;
      }

      const nextTokens = tokens.slice(index + 1, index + 4);
      const objectToken = nextTokens.find(
        (candidate) =>
          !["a", "an", "the"].includes(this.normalize(candidate.text))
      );

      const taskText = objectToken
        ? `${token.text} ${objectToken.text}`
        : token.text;

      mentions.push(
        this.createMention({
          extractionId,
          token: {
            text: taskText,
            startOffset: token.startOffset,
            endOffset: objectToken?.endOffset ?? token.endOffset,
          },
          kind: "task_or_obligation",
          role: "object",
          confidence: 0.55,
        })
      );
    }

    return mentions;
  }

  private createMention(input: {
    extractionId: string;
    token: TokenMatch;
    kind: EntityMentionKind;
    role: MentionedEntityRole;
    confidence: number;
  }): EntityMention {
    const normalizedText = this.normalize(input.token.text);

    return {
      id: crypto.randomUUID(),
      extractionId: input.extractionId,
      text: input.token.text,
      normalizedText,
      kind: input.kind,
      role: input.role,
      startOffset: input.token.startOffset,
      endOffset: input.token.endOffset,
      confidence: input.confidence,
      resolutionHints: [
        {
          kind: input.kind,
          normalizedText,
          confidence: input.confidence,
        },
      ],
    };
  }

  private inferRole(kind: EntityMentionKind): MentionedEntityRole {
    switch (kind) {
      case "current_operator":
        return "actor";

      case "person_name":
      case "pronoun":
        return "related_party";

      case "emotion_expression":
        return "state";

      default:
        return "unknown";
    }
  }

  private confidenceFor(kind: EntityMentionKind): number {
    switch (kind) {
      case "current_operator":
        return 0.95;

      case "pronoun":
        return 0.7;

      case "person_name":
        return 0.65;

      case "emotion_expression":
        return 0.6;

      default:
        return 0.5;
    }
  }

  private normalize(text: string): string {
    return text.trim().toLowerCase();
  }
}