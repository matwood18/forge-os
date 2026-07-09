import { prisma } from "@/lib/infrastructure/prisma/client";
import type {
  ExecutiveConcern,
  ExecutiveConcernClarification,
  ExecutiveConcernCreateInput,
  ExecutiveConcernEvidence,
  ExecutiveConcernRecommendation,
  ExecutiveConcernRepository,
  ExecutiveConcernResolution,
  ExecutiveConcernStatus,
  ExecutiveConcernUpdateInput,
} from "@/lib/executive/concern";

type PersistedExecutiveConcern = Awaited<
  ReturnType<typeof prisma.executiveConcern.findUnique>
>;

function assertConfidence(confidence: number): void {
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    throw new Error("Executive concern confidence must be between 0 and 1.");
  }
}

function parseJson<T>(payload: string | null): T | undefined {
  if (!payload) {
    return undefined;
  }

  return JSON.parse(payload) as T;
}

function serializeJson(value: unknown | undefined): string | null {
  return value === undefined ? null : JSON.stringify(value);
}

function parseEvidence(payload: string): ExecutiveConcernEvidence[] {
  const evidence = JSON.parse(payload) as ExecutiveConcernEvidence[];

  return evidence.map((item) => ({
    ...item,
    observedAt: new Date(item.observedAt),
  }));
}

function serializeEvidence(evidence: ExecutiveConcernEvidence[]): string {
  return JSON.stringify(evidence);
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

function toDomain(
  record: NonNullable<PersistedExecutiveConcern>
): ExecutiveConcern {
  return {
    id: record.id,
    title: record.title,
    status: record.status as ExecutiveConcernStatus,
    importance: record.importance as ExecutiveConcern["importance"],
    confidence: record.confidence,
    firstObserved: record.firstObserved,
    lastObserved: record.lastObserved,
    supportingEvidence: parseEvidence(record.supportingEvidencePayload),
    latestRecommendation: parseJson<ExecutiveConcernRecommendation>(
      record.latestRecommendationPayload
    ),
    clarificationNeeded: parseJson<ExecutiveConcernClarification>(
      record.clarificationNeededPayload
    ),
    resolution: parseJson<ExecutiveConcernResolution>(record.resolutionPayload),
  };
}

export class PrismaExecutiveConcernRepository
  implements ExecutiveConcernRepository
{
  async create(input: ExecutiveConcernCreateInput): Promise<ExecutiveConcern> {
    assertConfidence(input.confidence);

    const record = await prisma.executiveConcern.create({
      data: {
        id: input.id,
        title: input.title,
        status: input.status ?? "open",
        importance: input.importance,
        confidence: input.confidence,
        firstObserved: input.observedAt,
        lastObserved: input.observedAt,
        supportingEvidencePayload: serializeEvidence(
          uniqueEvidence([], input.evidence)
        ),
        latestRecommendationPayload: serializeJson(input.latestRecommendation),
        clarificationNeededPayload: serializeJson(input.clarificationNeeded),
      },
    });

    return toDomain(record);
  }

  async update(input: ExecutiveConcernUpdateInput): Promise<ExecutiveConcern> {
    const existing = await this.findById(input.id);

    if (!existing) {
      throw new Error(`Executive concern not found: ${input.id}`);
    }

    if (input.confidence !== undefined) {
      assertConfidence(input.confidence);
    }

    const lastObserved = input.observedAt
      ? new Date(
          Math.max(existing.lastObserved.getTime(), input.observedAt.getTime())
        )
      : existing.lastObserved;

    const record = await prisma.executiveConcern.update({
      where: { id: input.id },
      data: {
        status: input.status ?? existing.status,
        importance: input.importance ?? existing.importance,
        confidence: input.confidence ?? existing.confidence,
        lastObserved,
        supportingEvidencePayload: serializeEvidence(
          uniqueEvidence(existing.supportingEvidence, input.evidence ?? [])
        ),
        latestRecommendationPayload: serializeJson(
          input.latestRecommendation ?? existing.latestRecommendation
        ),
        clarificationNeededPayload: serializeJson(
          input.clarificationNeeded ?? existing.clarificationNeeded
        ),
        resolutionPayload: serializeJson(input.resolution ?? existing.resolution),
      },
    });

    return toDomain(record);
  }

  async findById(id: string): Promise<ExecutiveConcern | undefined> {
    const record = await prisma.executiveConcern.findUnique({
      where: { id },
    });

    return record ? toDomain(record) : undefined;
  }

  async list(): Promise<ExecutiveConcern[]> {
    const records = await prisma.executiveConcern.findMany({
      orderBy: { lastObserved: "desc" },
    });

    return records.map(toDomain);
  }

  async listByStatus(
    status: ExecutiveConcernStatus
  ): Promise<ExecutiveConcern[]> {
    const records = await prisma.executiveConcern.findMany({
      where: { status },
      orderBy: { lastObserved: "desc" },
    });

    return records.map(toDomain);
  }

  async clear(): Promise<void> {
    await prisma.executiveConcern.deleteMany();
  }
}
