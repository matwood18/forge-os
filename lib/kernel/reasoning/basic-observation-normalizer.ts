import type { Observation } from "./types";
import type { ObservationCandidate } from "./candidate-schema";

export class BasicObservationNormalizer {
  normalize(
    candidates: ObservationCandidate[]
  ): Observation[] {
    const seen = new Set<string>();
    const observations: Observation[] = [];

    for (const candidate of candidates) {
      const value = candidate.value.trim();

      if (!value) {
        continue;
      }

      const confidence = Math.max(
        0,
        Math.min(1, candidate.confidence)
      );

      const key = `${candidate.kind}:${value.toLowerCase()}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);

      observations.push({
        id: crypto.randomUUID(),
        kind: candidate.kind,
        value,
        confidence,
        reason: candidate.source,
      });
    }

    return observations;
  }
}