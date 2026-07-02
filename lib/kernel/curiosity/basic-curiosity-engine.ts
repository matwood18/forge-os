import type { Question } from "@/lib/domain";
import type { PersonStore } from "@/lib/kernel/person-store";

import type { CuriosityEngine } from "./curiosity-engine";
import type { CuriosityInput, CuriosityResult } from "./types";

export class BasicCuriosityEngine implements CuriosityEngine {
  constructor(private readonly personStore: PersonStore) {}

  async generate(input: CuriosityInput): Promise<CuriosityResult> {
    const questions: Question[] = [];

    for (const observation of input.observations) {
      if (observation.kind !== "possible-person") {
        continue;
      }

      const candidates = await this.personStore.findCandidatesByMention(
        observation.value
      );

      const exactCandidate = candidates.find(
        (candidate) => candidate.confidence >= 0.95
      );

      if (exactCandidate) {
        continue;
      }

      const bestCandidate = candidates[0];

      questions.push({
        id: crypto.randomUUID(),
        type: "identity-resolution",
        prompt: bestCandidate
          ? `Did you mean ${bestCandidate.person.displayName}, or another ${observation.value}?`
          : `Who is "${observation.value}" in this context?`,
        status: "open",
        impact: 75,
        createdAt: new Date(),
      });
    }

    return { questions };
  }
}