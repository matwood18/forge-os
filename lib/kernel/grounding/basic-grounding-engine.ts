// lib/kernel/grounding/basic-grounding-engine.ts
import type { GroundingEngine } from "./grounding-engine";
import type { GroundingRepository } from "./grounding-repository";
import type {
  GroundingDecision,
  GroundingDecisionStatus,
  GroundingEngineInput,
  GroundingEngineResult,
} from "./types";

export class BasicGroundingEngine implements GroundingEngine {
  constructor(private readonly repository: GroundingRepository) {}

  async ground(input: GroundingEngineInput): Promise<GroundingEngineResult> {
    const decisions = input.interpretation.signals.map((signal, index) => {
      const status = this.determineStatus(signal.kind);

      return {
        id: `${input.interpretation.id}:grounding:${index + 1}`,
        signal,
        status,
        subjectEntityId: this.subjectEntityIdFor(status),
        confidence: this.confidenceFor(status),
        rationale: this.rationaleFor(status),
      } satisfies GroundingDecision;
    });

    const record = await this.repository.save({
      id: `${input.interpretation.id}:grounding`,
      interpretation: input.interpretation,
      groundedAt: new Date(),
      decisions,
    });

    return { record };
  }

  private determineStatus(kind: string): GroundingDecisionStatus {
    if (kind === "person_reference") {
      return "unresolved";
    }

    if (
      kind === "temporal_reference" ||
      kind === "repeated_failure_mode"
    ) {
      return "ignored";
    }

    return "unresolved";
  }

  private subjectEntityIdFor(status: GroundingDecisionStatus): string | null {
    if (status !== "grounded") {
      return null;
    }

    return "current-operator";
  }

  private confidenceFor(status: GroundingDecisionStatus): number {
    if (status === "ignored") {
      return 1;
    }

    if (status === "grounded") {
      return 0.8;
    }

    if (status === "ambiguous") {
      return 0.4;
    }

    return 0.2;
  }

  private rationaleFor(status: GroundingDecisionStatus): string {
    if (status === "ignored") {
      return "This semantic signal does not require entity grounding.";
    }

    if (status === "grounded") {
      return "The signal was deterministically grounded to a canonical entity.";
    }

    if (status === "ambiguous") {
      return "The signal could refer to more than one canonical entity.";
    }

    return "No canonical entity could be safely assigned yet.";
  }
}