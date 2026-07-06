import type { ArgumentGenerator } from "./argument-generator";
import type { ReasoningContext } from "./reasoning-context";
import type { CandidateArgument } from "./types";

export class ObjectiveArgumentGenerator implements ArgumentGenerator {
  async generate(context: ReasoningContext): Promise<CandidateArgument[]> {
    if (!context.objective) {
      return [];
    }

    return [
      {
        id: crypto.randomUUID(),
        claim: context.objective,
        status: "inconclusive",
        confidence: 0,
        strength: "weak",
        supportingBeliefIds: [],
        assumptionIds: [],
        counterArgumentIds: [],
        generatedQuestionIds: [],
      },
    ];
  }
}