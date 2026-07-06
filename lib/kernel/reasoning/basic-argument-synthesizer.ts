import type { ArgumentSynthesizer } from "./argument-synthesizer";
import type { Argument, CandidateArgument } from "./types";

const strengthRank = {
  weak: 0,
  moderate: 1,
  strong: 2,
} satisfies Record<Argument["strength"], number>;

export class BasicArgumentSynthesizer implements ArgumentSynthesizer {
  async synthesize(candidates: CandidateArgument[]): Promise<Argument[]> {
    const byClaim = new Map<string, CandidateArgument>();

    for (const candidate of candidates) {
      const key = candidate.claim.trim().toLowerCase();

      if (!key) {
        continue;
      }

      const existing = byClaim.get(key);

      if (!existing || this.isStronger(candidate, existing)) {
        byClaim.set(key, candidate);
      }
    }

    return [...byClaim.values()].map((candidate) => ({
      ...candidate,
      id: crypto.randomUUID(),
    }));
  }

  private isStronger(
    candidate: CandidateArgument,
    existing: CandidateArgument
  ): boolean {
    if (candidate.confidence !== existing.confidence) {
      return candidate.confidence > existing.confidence;
    }

    return strengthRank[candidate.strength] > strengthRank[existing.strength];
  }
}