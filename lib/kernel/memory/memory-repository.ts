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

export interface MemoryRepository {
  remember(memory: MemoryCreateInput): Promise<MemoryRecord>;

  confirm(memoryId: string, confidence: number, reason: string): Promise<MemoryRecord>;

  contradict(
    memoryId: string,
    confidence: number,
    reason: string
  ): Promise<MemoryRecord>;

  updateStatus(memoryId: string, status: MemoryStatus): Promise<MemoryRecord>;

  addEvidence(evidence: MemoryEvidenceCreateInput): Promise<MemoryEvidenceRecord>;

  addConfidenceSnapshot(
    snapshot: MemoryConfidenceSnapshotCreateInput
  ): Promise<MemoryConfidenceSnapshot>;

  findById(memoryId: string): Promise<MemoryRecord | null>;

  find(query: MemoryQuery): Promise<MemoryRecord[]>;

  evidenceFor(memoryId: string): Promise<MemoryEvidenceRecord[]>;

  confidenceHistoryFor(memoryId: string): Promise<MemoryConfidenceSnapshot[]>;

  all(): Promise<MemoryRecord[]>;
}