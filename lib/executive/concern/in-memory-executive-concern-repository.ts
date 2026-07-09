import type { ExecutiveConcernRepository } from "./executive-concern-repository";
import type {
  ExecutiveConcern,
  ExecutiveConcernCreateInput,
  ExecutiveConcernEvidence,
  ExecutiveConcernStatus,
  ExecutiveConcernUpdateInput,
} from "./types";

function assertConfidence(confidence: number): void {
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new Error("Executive concern confidence must be between 0 and 1.");
  }
}

function uniqueEvidence(
  existing: ExecutiveConcernEvidence[],
  incoming: ExecutiveConcernEvidence[]
): ExecutiveConcernEvidence[] {
  const byId = new Map<string, ExecutiveConcernEvidence>();

  for (const evidence of [...existing, ...incoming]) {
    byId.set(evidence.id, evidence);
  }

  return [...byId.values()].sort(
    (a, b) => a.observedAt.getTime() - b.observedAt.getTime()
  );
}

export class InMemoryExecutiveConcernRepository
  implements ExecutiveConcernRepository
{
  private readonly concerns = new Map<string, ExecutiveConcern>();

  async create(input: ExecutiveConcernCreateInput): Promise<ExecutiveConcern> {
    if (this.concerns.has(input.id)) {
      throw new Error(`Executive concern already exists: ${input.id}`);
    }

    assertConfidence(input.confidence);

    const concern: ExecutiveConcern = {
      id: input.id,
      title: input.title,
      status: input.status ?? "open",
      importance: input.importance,
      confidence: input.confidence,
      firstObserved: input.observedAt,
      lastObserved: input.observedAt,
      supportingEvidence: uniqueEvidence([], input.evidence),
      latestRecommendation: input.latestRecommendation,
      clarificationNeeded: input.clarificationNeeded,
    };

    this.concerns.set(concern.id, concern);

    return concern;
  }

  async update(input: ExecutiveConcernUpdateInput): Promise<ExecutiveConcern> {
    const existing = this.concerns.get(input.id);

    if (!existing) {
      throw new Error(`Executive concern not found: ${input.id}`);
    }

    if (input.confidence !== undefined) {
      assertConfidence(input.confidence);
    }

    const supportingEvidence = uniqueEvidence(
      existing.supportingEvidence,
      input.evidence ?? []
    );

    const lastObserved = input.observedAt
      ? new Date(
          Math.max(existing.lastObserved.getTime(), input.observedAt.getTime())
        )
      : existing.lastObserved;

    const updated: ExecutiveConcern = {
      ...existing,
      status: input.status ?? existing.status,
      importance: input.importance ?? existing.importance,
      confidence: input.confidence ?? existing.confidence,
      lastObserved,
      supportingEvidence,
      latestRecommendation:
        input.latestRecommendation ?? existing.latestRecommendation,
      clarificationNeeded:
        input.clarificationNeeded ?? existing.clarificationNeeded,
      resolution: input.resolution ?? existing.resolution,
    };

    this.concerns.set(updated.id, updated);

    return updated;
  }

  async findById(id: string): Promise<ExecutiveConcern | undefined> {
    return this.concerns.get(id);
  }

  async list(): Promise<ExecutiveConcern[]> {
    return [...this.concerns.values()].sort(
      (a, b) => b.lastObserved.getTime() - a.lastObserved.getTime()
    );
  }

  async listByStatus(
    status: ExecutiveConcernStatus
  ): Promise<ExecutiveConcern[]> {
    const concerns = await this.list();

    return concerns.filter((concern) => concern.status === status);
  }

  async clear(): Promise<void> {
    this.concerns.clear();
  }
}
