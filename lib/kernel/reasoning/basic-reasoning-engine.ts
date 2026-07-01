import type { ReasoningEngine } from "./reasoning-engine";
import type { Observation, ReasoningInput, ReasoningResult } from "./types";

const COMMON_WORDS = new Set([
  "I",
  "Met",
  "Had",
  "Talked",
  "Played",
  "Called",
  "Texted",
  "Emailed",
  "Sent",
  "Received",
  "The",
  "A",
  "An",
  "He",
  "She",
  "They",
  "We",
  "For",
  "This",
  "That",
]);

export class BasicReasoningEngine implements ReasoningEngine {
  async reason(input: ReasoningInput): Promise<ReasoningResult> {
    const observations: Observation[] = [];
    const consumed = new Set<string>();

    const fullNames = input.text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) ?? [];

    for (const value of fullNames) {
      observations.push({
        id: crypto.randomUUID(),
        kind: "possible-person",
        value,
        confidence: 0.85,
        reason: "Capitalized full name detected in manual capture.",
      });

      for (const part of value.split(" ")) {
        consumed.add(part);
      }
    }

    const possibleNames = input.text.match(/\b[A-Z][a-z]+\b/g) ?? [];

    for (const value of possibleNames) {
      if (COMMON_WORDS.has(value) || consumed.has(value)) {
        continue;
      }

      observations.push({
        id: crypto.randomUUID(),
        kind: "possible-person",
        value,
        confidence: 0.7,
        reason: "Capitalized word detected in manual capture.",
      });
    }

    return { observations };
  }
}