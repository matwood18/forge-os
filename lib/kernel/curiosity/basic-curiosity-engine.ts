import type { Question } from "@/lib/domain";
import type { EntityRepository } from "@/lib/kernel/repositories";
import type { PersonStore } from "@/lib/kernel/person-store";

import type { CuriosityEngine } from "./curiosity-engine";
import type { CuriosityInput, CuriosityResult } from "./types";

export class BasicCuriosityEngine implements CuriosityEngine {
  constructor(
    private readonly personStore: PersonStore,
    private readonly entityRepository?: EntityRepository
  ) {}

  async generate(input: CuriosityInput): Promise<CuriosityResult> {
    const questions: Question[] = [];

    for (const observation of input.observations) {
      if (observation.kind !== "possible-person") continue;

      const entityCandidates = this.entityRepository
        ? await this.entityRepository.findCandidatesByMention(
            observation.value,
            "PERSON"
          )
        : [];

      const exactEntityCandidate = entityCandidates.find(
        (candidate) => candidate.confidence >= 0.95
      );

      if (exactEntityCandidate) continue;

      if (entityCandidates.length > 0) {
        const topCandidates = entityCandidates.slice(0, 4);

        questions.push({
          id: crypto.randomUUID(),
          type: "identity-resolution",
          prompt:
            topCandidates.length === 1
              ? `Did you mean ${topCandidates[0].entity.displayName}, or someone else?`
              : `Which ${observation.value} did you mean?`,
          status: "open",
          impact: 75,
          createdAt: new Date(),
          options: [
            ...topCandidates.map((candidate) => ({
              id: candidate.entity.id,
              label: candidate.entity.displayName,
              value: candidate.entity.displayName,
            })),
            {
              id: "someone-else",
              label: "Someone else",
              value: "__DIFFERENT_PERSON__",
            },
          ],
        });

        continue;
      }

      const candidates = await this.personStore.findCandidatesByMention(
        observation.value
      );

      const exactCandidate = candidates.find(
        (candidate) => candidate.confidence >= 0.95
      );

      if (exactCandidate) continue;

      questions.push({
        id: crypto.randomUUID(),
        type: "identity-resolution",
        prompt: `Who is "${observation.value}" in this context?`,
        status: "open",
        impact: 75,
        createdAt: new Date(),
      });
    }

    return { questions };
  }
}