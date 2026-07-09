import type { ExecutiveSituationProvider } from "../executive-situation-provider";
import type {
  ExecutiveSituationCandidate,
  ExecutiveSituationInput,
  ExecutiveSituationResult,
} from "../types";

export class BasicExecutiveSituationProvider
  implements ExecutiveSituationProvider
{
  async interpret(
    input: ExecutiveSituationInput
  ): Promise<ExecutiveSituationResult> {
    const situations: ExecutiveSituationCandidate[] =
      input.evidence.map((evidence, index) => ({
        id: `basic-situation:${index + 1}`,
        title: evidence.label,
        summary: evidence.summary,
        evidenceIds: [evidence.id],
        identityEvidenceIds: evidence.identityEvidenceIds,
        confidence: evidence.confidence ?? 0.5,
      }));

    return {
      situations,
      generatedAt: new Date(),
    };
  }
}
