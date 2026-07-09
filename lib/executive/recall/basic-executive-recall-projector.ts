import type { ExecutiveConcern, ExecutiveConcernImportance } from "../concern";
import type { ExecutiveConcernRepository } from "../concern";
import type { ExecutiveRecallProjector } from "./executive-recall-projector";
import type {
  ExecutiveRecallInput,
  ExecutiveRecallResult,
  ExecutiveRecalledConcern,
} from "./types";

const OPEN_RECALL_STATUSES = new Set<ExecutiveConcern["status"]>([
  "open",
  "watching",
  "blocked",
]);

const IMPORTANCE_WEIGHT: Record<ExecutiveConcernImportance, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function supportingEvidenceIds(concern: ExecutiveConcern): string[] {
  return concern.supportingEvidence.map((evidence) => evidence.id);
}

function compareRecallPriority(
  left: ExecutiveConcern,
  right: ExecutiveConcern
): number {
  const importanceDelta =
    IMPORTANCE_WEIGHT[right.importance] - IMPORTANCE_WEIGHT[left.importance];

  if (importanceDelta !== 0) {
    return importanceDelta;
  }

  const recencyDelta = right.lastObserved.getTime() - left.lastObserved.getTime();

  if (recencyDelta !== 0) {
    return recencyDelta;
  }

  return left.id.localeCompare(right.id);
}

function recallReason(concern: ExecutiveConcern): string {
  if (concern.status === "blocked") {
    return "Unresolved blocked concern remains part of executive memory.";
  }

  if (concern.status === "watching") {
    return "Concern is still being watched across executions.";
  }

  return "Open concern remains unresolved across executions.";
}

export class BasicExecutiveRecallProjector implements ExecutiveRecallProjector {
  constructor(private readonly repository: ExecutiveConcernRepository) {}

  async project(input: ExecutiveRecallInput): Promise<ExecutiveRecallResult> {
    const allConcerns = await this.repository.list();

    const eligibleConcerns = allConcerns
      .filter((concern) => OPEN_RECALL_STATUSES.has(concern.status))
      .sort(compareRecallPriority);

    const boundedConcerns = eligibleConcerns.slice(
      0,
      Math.max(0, input.maxConcerns)
    );

    const recalledConcerns: ExecutiveRecalledConcern[] = boundedConcerns.map(
      (concern) => ({
        concern,
        reason: recallReason(concern),
        evidenceIds: supportingEvidenceIds(concern),
      })
    );

    return {
      generatedAt: input.asOf,
      maxConcerns: input.maxConcerns,
      recalledConcerns,
      excludedConcernCount: allConcerns.length - recalledConcerns.length,
      totalConcernCount: allConcerns.length,
    };
  }
}
