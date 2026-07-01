import type { Question } from "@/lib/domain";

import type { CuriosityEngine } from "./curiosity-engine";
import type { CuriosityInput, CuriosityResult } from "./types";

export class BasicCuriosityEngine implements CuriosityEngine {
  async generate(
    input: CuriosityInput
  ): Promise<CuriosityResult> {
    const questions: Question[] = [];

    for (const observation of input.observations) {
      if (observation.kind !== "possible-person") {
        continue;
      }

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