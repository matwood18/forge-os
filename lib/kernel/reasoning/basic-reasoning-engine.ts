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
]);

export class BasicReasoningEngine implements ReasoningEngine {
  async reason(input: ReasoningInput): Promise<ReasoningResult> {
    const observations: Observation[] = [];

    const possibleNames = input.text.match(/\b[A-Z][a-z]+\b/g) ?? [];

    for (const value of possibleNames) {
      if (COMMON_WORDS.has(value)) {
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