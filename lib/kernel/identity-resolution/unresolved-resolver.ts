import type { IdentityResolver } from "./resolver";
import type {
  IdentityEvidence,
  IdentityResolutionResult,
} from "./types";
import { createIdentityResolutionQuestion } from "./question-factory";

export class UnresolvedIdentityResolver implements IdentityResolver {
  async resolve(
    evidence: IdentityEvidence[]
  ): Promise<IdentityResolutionResult> {
    const question = createIdentityResolutionQuestion(evidence);

    return {
      status: "question-required",
      kind: "unknown",
      confidence: 0,
      questionId: question.id,
    };
  }
}