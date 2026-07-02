import type {
  MemoryConfidenceSnapshot,
  MemoryConfidenceSnapshotCreateInput,
  MemoryCreateInput,
  MemoryEvidenceCreateInput,
  MemoryEvidenceRecord,
  MemoryQuery,
  MemoryRecord,
  MemoryStatus,
} from "./types";

import type { MemoryRepository } from "./memory-repository";

export class InMemoryMemoryRepository implements MemoryRepository {
  private readonly memories = new Map<string, MemoryRecord>();

  private readonly evidence = new Map<string, MemoryEvidenceRecord[]>();

  private readonly confidenceHistory = new Map<
    string,
    MemoryConfidenceSnapshot[]
  >();

  async remember(memory: MemoryCreateInput): Promise<MemoryRecord> {
    const now = new Date();

    const record: MemoryRecord = {
      id: crypto.randomUUID(),
      ...memory,
      status: "active",
      firstLearnedAt: now,
      lastConfirmedAt: now,
      lastContradictedAt: null,
      forgottenAt: null,
      createdAt: now,
      updatedAt: now,
    };

    this.memories.set(record.id, record);

    return record;
  }

  async confirm(
    memoryId: string,
    confidence: number,
    reason: string
  ): Promise<MemoryRecord> {
    const memory = this.requireMemory(memoryId);
    const now = new Date();

    const updated: MemoryRecord = {
      ...memory,
      confidence,
      status: "active",
      lastConfirmedAt: now,
      updatedAt: now,
    };

    this.memories.set(memoryId, updated);

    await this.addConfidenceSnapshot({
      memoryId,
      confidence,
      reason,
    });

    return updated;
  }

  async contradict(
    memoryId: string,
    confidence: number,
    reason: string
  ): Promise<MemoryRecord> {
    const memory = this.requireMemory(memoryId);
    const now = new Date();

    const updated: MemoryRecord = {
      ...memory,
      confidence,
      status: "contradicted",
      lastContradictedAt: now,
      updatedAt: now,
    };

    this.memories.set(memoryId, updated);

    await this.addConfidenceSnapshot({
      memoryId,
      confidence,
      reason,
    });

    return updated;
  }

  async updateStatus(
    memoryId: string,
    status: MemoryStatus
  ): Promise<MemoryRecord> {
    const memory = this.requireMemory(memoryId);
    const now = new Date();

    const updated: MemoryRecord = {
      ...memory,
      status,
      forgottenAt: status === "forgotten" ? now : memory.forgottenAt,
      updatedAt: now,
    };

    this.memories.set(memoryId, updated);

    return updated;
  }

  async addEvidence(
    evidence: MemoryEvidenceCreateInput
  ): Promise<MemoryEvidenceRecord> {
    this.requireMemory(evidence.memoryId);

    const record: MemoryEvidenceRecord = {
      id: crypto.randomUUID(),
      ...evidence,
      createdAt: new Date(),
    };

    const existing = this.evidence.get(evidence.memoryId) ?? [];
    this.evidence.set(evidence.memoryId, [...existing, record]);

    return record;
  }

  async addConfidenceSnapshot(
    snapshot: MemoryConfidenceSnapshotCreateInput
  ): Promise<MemoryConfidenceSnapshot> {
    this.requireMemory(snapshot.memoryId);

    const record: MemoryConfidenceSnapshot = {
      id: crypto.randomUUID(),
      ...snapshot,
      createdAt: new Date(),
    };

    const existing = this.confidenceHistory.get(snapshot.memoryId) ?? [];
    this.confidenceHistory.set(snapshot.memoryId, [...existing, record]);

    return record;
  }

  async findById(memoryId: string): Promise<MemoryRecord | null> {
    return this.memories.get(memoryId) ?? null;
  }

  async find(query: MemoryQuery): Promise<MemoryRecord[]> {
    return Array.from(this.memories.values()).filter((memory) => {
      return (
        matches(query.subjectEntityId, memory.subjectEntityId) &&
        matches(query.predicate, memory.predicate) &&
        matchesNullable(query.objectEntityId, memory.objectEntityId) &&
        matchesNullable(query.objectValue, memory.objectValue) &&
        matches(query.status, memory.status) &&
        matches(query.kind, memory.kind)
      );
    });
  }

  async evidenceFor(memoryId: string): Promise<MemoryEvidenceRecord[]> {
    this.requireMemory(memoryId);

    return this.evidence.get(memoryId) ?? [];
  }

  async confidenceHistoryFor(
    memoryId: string
  ): Promise<MemoryConfidenceSnapshot[]> {
    this.requireMemory(memoryId);

    return this.confidenceHistory.get(memoryId) ?? [];
  }

  async all(): Promise<MemoryRecord[]> {
    return Array.from(this.memories.values());
  }

  private requireMemory(memoryId: string): MemoryRecord {
    const memory = this.memories.get(memoryId);

    if (!memory) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    return memory;
  }
}

function matches<T>(queryValue: T | undefined, actualValue: T): boolean {
  return queryValue === undefined || queryValue === actualValue;
}

function matchesNullable<T>(
  queryValue: T | null | undefined,
  actualValue: T | null | undefined
): boolean {
  return queryValue === undefined || queryValue === actualValue;
}